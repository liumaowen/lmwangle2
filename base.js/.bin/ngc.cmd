@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe" --max_old_space_size=5048 "%~dp0\..\@angular\compiler-cli\src\main.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node --max_old_space_size=5048 "%~dp0\..\@angular\compiler-cli\src\main.js" %*
)