from fastapi import FastAPI

from app.config.database import Base
from app.config.database import engine

from app.routes.auth import router


Base.metadata.create_all(
    bind=engine
)

app = FastAPI(
    title="CareerLens AI"
)

app.include_router(router)


@app.get("/")
def home():

    return {
        "message": "CareerLens AI Backend Running"
    }