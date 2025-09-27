# finWise

## database setup
  run .sql files from /db folder in mysql workbench  


## backend setup
  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"  
  cd backend  
  uv venv  
  .venv\Scripts\activate  
  uv sync"  


## run backend
  cd backend  
  uv run run.py  
