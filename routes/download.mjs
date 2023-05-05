import fs from 'fs'
import path from 'path'
import express from 'express'
let router = express.Router()

import {
  getHTMLFromURL,
  getFileName,
  parseHTML,
  convertToMarkdown,
  buildMarkdownWithFrontmatter,
  __filename
} from '../app/utils.mjs'

router.get('/', function (req, res, next) {
  if (req.query.download == 'local' && req.hostname != 'localhost') {
    let error = new Error('Local download supported only running the webservice locally.');
    console.error(error)
    res.status(422).end()
    next(error)
  }

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
    debugger
    if (download == 'local') {
      fs.writeFileSync(path.join('.', 'Inbox', fileName), fileContent)
      console.log('File saved: ' + 'Inbox/' + fileName)
      res.status(201).end()
    } else {
      // Send file to the client as inline attachment
    }
  })(req.query.u, req.query.download, req.query.tags);
});

export default router
