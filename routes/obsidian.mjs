import express from 'express'
let router = express.Router()

import {
  getHTMLFromURL,
  getFileName,
  parseHTML,
  convertToMarkdown,
  buildMarkdownWithFrontmatter,
  buildObsidianURL
} from '../app/utils.mjs'

router.get('/', function (req, res, next) {
  (async (url, download, tags = []) => {
    var htmlContent = ''

    try {
      htmlContent = await getHTMLFromURL(url)
    } catch (error) {
      console.error(error)
      res.status(422).end()
      return
    }

    let { title, content, excerpt } = parseHTML(htmlContent, url)

    const fileName = getFileName(title)

    let markdown = convertToMarkdown(content)

    const fileContent = buildMarkdownWithFrontmatter({ markdown, tags, url, excerpt })

    let redirectToURL = buildObsidianURL({ fileName, fileContent })
    res.set('Location', redirectToURL)
    res.redirect(302, redirectToURL)
  })(req.query.u, req.query.tags);
});

export default router
