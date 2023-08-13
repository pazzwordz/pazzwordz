import dirTree from 'directory-tree';
import * as fs from "fs";

let baseRoute = "/";
let routes: string[] = [baseRoute]
let date = new Date().toISOString().split('T')[0]

function getSitemapXML(domain: string, routes: string[]) {
    let sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    sitemap += "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
    routes.forEach(route => {
        sitemap += getSitemapUrl(domain + route)
    })
    sitemap += "\n</urlset>"
    return sitemap;
}

function getSitemapUrl(location: string) {
    let url =
        "<url>\n" +
        `<loc>${location}</loc>\n` +
        `<lastmod>${date}</lastmod>\n` +
        "</url>";
    return url
}

function getEndpoints(tree: dirTree.DirectoryTree, route: string) {
    tree.children!.forEach(child => {
        if (child.children != undefined && child.children.length != 0) {
            let childRoute = route + child.name;
            if (child.children.some(e => e.name === '+page.svelte')) {
                routes.push(childRoute)
            }
            getEndpoints(child, childRoute + "/");
        }
    })
}


const tree = dirTree("./src/routes")

getEndpoints(tree, baseRoute);

const sitemap = getSitemapXML("https://www.pazzwordz.io", routes)

fs.writeFileSync('./static/sitemap.xml', sitemap);
