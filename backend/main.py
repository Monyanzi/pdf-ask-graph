import os
import tempfile
from typing import List, Dict, Any

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langgraph.graph import StateGraph, END
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# Set your OpenAI API key
if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = "your-api-key"


# Shared RAG state
class RAGState(dict):
    pdf_path: str
    documents: List[Document]
    chunks: List[Document]
    vectorstore: Any
    query: str
    retrieved_docs: List[Document]
    answer: str


# 1. Ingestion Node
def ingest_pdf_node(state: RAGState) -> RAGState:
    loader = PyPDFLoader(state['pdf_path'])
    documents = loader.load()
    state['documents'] = documents
    return state


# 2. Text Extraction + Chunking Node
def chunk_documents_node(state: RAGState) -> RAGState:
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(state['documents'])
    state['chunks'] = chunks
    return state


# 3. Embedding & Indexing Node
def embedding_index_node(state: RAGState) -> RAGState:
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_documents(state['chunks'], embeddings)
    state['vectorstore'] = vectorstore
    return state


# 4. Retrieval Node
def retrieve_node(state: RAGState) -> RAGState:
    retriever = state['vectorstore'].as_retriever(search_kwargs={"k": 5})
    retrieved_docs = retriever.get_relevant_documents(state['query'])
    state['retrieved_docs'] = retrieved_docs
    return state


# 5. LLM Node
def llm_node(state: RAGState) -> RAGState:
    llm = ChatOpenAI(model="gpt-3.5-turbo")
    qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=state['vectorstore'].as_retriever())
    answer = qa_chain.run(state['query'])
    state['answer'] = answer
    return state


# Build LangGraph
rag_graph = StateGraph(RAGState)

# Define steps
rag_graph.add_node("ingest_pdf", ingest_pdf_node)
rag_graph.add_node("chunk_docs", chunk_documents_node)
rag_graph.add_node("embed_and_index", embedding_index_node)
rag_graph.add_node("retrieve", retrieve_node)
rag_graph.add_node("generate_answer", llm_node)

# Define flow
rag_graph.set_entry_point("ingest_pdf")
rag_graph.add_edge("ingest_pdf", "chunk_docs")
rag_graph.add_edge("chunk_docs", "embed_and_index")
rag_graph.add_edge("embed_and_index", "retrieve")
rag_graph.add_edge("retrieve", "generate_answer")
rag_graph.add_edge("generate_answer", END)

# Compile
app_runnable = rag_graph.compile()

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InvokeRequest(BaseModel):
    query: str


@app.post("/invoke")
async def invoke(query: str = Form(...), pdf_file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(await pdf_file.read())
            tmp_path = tmp.name

        input_state = {
            "pdf_path": tmp_path,
            "query": query
        }
        final_state = app_runnable.invoke(input_state)
        os.remove(tmp_path)
        return {"answer": final_state['answer']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
