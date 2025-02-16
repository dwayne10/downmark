import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http'
import https from 'https'
import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'
import createDOMPurify from 'dompurify'
let window = new JSDOM('').window;
let DOMPurify = createDOMPurify(window);
import slugify from 'slugify'
import TurndownService from 'turndown'
import turndownPluginGfm from 'turndown-plugin-gfm'
import crypto from 'crypto'

const defaultTags = ['#clippings-from-chrome']

const getHTMLFromURL = (url) => {
  return new Promise((resolve, reject) => {

    let client = http;

    if (url.toString().indexOf("https") === 0) {
      client = https;
    }

    client.get(url, (resp) => {
      // if ([301, 302, 307, 308].includes(resp.statusCode)) {
      //   console.log('redirected to ' + resp.headers.location)
      //   return getHTMLFromURL(resp.headers.location)
      // }
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(data);
      });

    }).on("error", (err) => {
      reject(err);
    });
  });
};

// const getFileName = (fileName) => {
//   return slugify(fileName.slice(0, 100) + '.md', { remove: /[*+~.()'"!:@\/\\]/g })
// }

const getFileName = (fileName) => {
  return fileName.replace(':', '').replace(/\//g, '-').replace(/\\/g, '-');
}

const convertDate = (date) => {
  var yyyy = date.getFullYear().toString();
  var mm = (date.getMonth() + 1).toString();
  var dd = date.getDate().toString();
  var mmChars = mm.split('');
  var ddChars = dd.split('');
  return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
}

const parseHTML = (htmlContent, url) => {
  let doc = new JSDOM(htmlContent, { url })
  let reader = new Readability(doc.window.document, {
    keepClasses: true
  })
  let result = reader.parse()

  let title = result?.title || 'no title ' + crypto.randomBytes(8).toString('hex')
  let content = result?.content || result?.excerpt || 'Cannot parse content...'

  const sanitizedContent = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } })

  return { title, content: sanitizedContent, excerpt: result?.excerpt || '' }
}

const convertToMarkdown = (content) => {
  const turndownService = new TurndownService({
    preformattedCode: true,
    codeBlockStyle: 'fenced',
    bulletListMarker: '-'
  }).use(turndownPluginGfm.gfm)

  return turndownService.turndown(content)
}

const buildMarkdownWithFrontmatter = ({ markdown, tags, url, excerpt }) => {
  const markdownWithFrontmatter = "---\n"
    + "date: " + convertDate(new Date()) + "\n"
    + "source: " + url + "\n"
    + "---\n\n"
    + "Tags:: " + [...defaultTags, ...tags].join(' ') + "\n\n"
    + "> ## Excerpt" + "\n"
    + "> " + excerpt + "\n"
    + "---\n\n"
    + markdown

  return markdownWithFrontmatter
}

const buildObsidianURL = ({ vault = 'Obsidian Notes', folder = 'Inbox/', fileName, fileContent }) => {
  // let vaultName

  // if (vault) {
  //   vaultName = '&vault=' + encodeURIComponent(`${vault}`)
  // } else {
  //   vaultName = ''
  // }

  return "obsidian://new?vault=" + encodeURIComponent(`${vault}`)
    + "&file=" + encodeURIComponent(folder + fileName)
    + "&content=" + encodeURIComponent(fileContent)
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export {
  getHTMLFromURL,
  getFileName,
  convertDate,
  __filename,
  __dirname,
  parseHTML,
  convertToMarkdown,
  buildMarkdownWithFrontmatter,
  buildObsidianURL
};
