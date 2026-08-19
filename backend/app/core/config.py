from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/postgres"
    jwt_secret: str = "development-only-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    ai_service_url: str = "http://127.0.0.1:8001"
    frontend_url: str = "http://localhost:3000"
    environment: str = "development"
    supabase_url: str | None = None
    supabase_anon_key: str | None = None
    supabase_service_role_key: str | None = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
