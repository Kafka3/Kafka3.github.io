function getMatchPattern(segments) {
  return segments.map((segment) => {
    return segment[0].spread ? "(?:\\/(.*?))?" : "\\/" + segment.map((part) => {
      if (part)
        return part.dynamic ? "([^/]+?)" : part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("");
  }).join("");
}
function getReplacePattern(segments) {
  let n = 0;
  let result = "";
  for (const segment of segments) {
    for (const part of segment) {
      if (part.dynamic)
        result += "$" + ++n;
      else
        result += part.content;
    }
    result += "/";
  }
  result = result.slice(0, -1);
  return result;
}
function getRedirects(routes, config) {
  let redirects = [];
  if (config.trailingSlash === "always") {
    for (const route of routes) {
      if (route.type !== "page" || route.segments.length === 0)
        continue;
      redirects.push({
        src: config.base + getMatchPattern(route.segments),
        headers: { Location: config.base + getReplacePattern(route.segments) + "/" },
        status: 308
      });
    }
  } else if (config.trailingSlash === "never") {
    for (const route of routes) {
      if (route.type !== "page" || route.segments.length === 0)
        continue;
      redirects.push({
        src: config.base + getMatchPattern(route.segments) + "/",
        headers: { Location: config.base + getReplacePattern(route.segments) },
        status: 308
      });
    }
  }
  return redirects;
}
export {
  getRedirects
};
