// Interactive API reference rendered by Swagger UI from public/openapi.json.
const SWAGGER_UI = "https://unpkg.com/swagger-ui-dist@5.17.14";

const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CampusCart API | Swagger UI</title>
  <link rel="stylesheet" href="${SWAGGER_UI}/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="${SWAGGER_UI}/swagger-ui-bundle.js" crossorigin></script>
  <script>
    window.ui = SwaggerUIBundle({ url: "/openapi.json", dom_id: "#swagger-ui", deepLinking: true });
  </script>
</body>
</html>`;

export function GET() {
  return new Response(page, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
