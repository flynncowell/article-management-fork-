import SheetUtils from "./SheetUtils";
import Article from "./Article";
import Editor from "./people/Editor";
import { assignExisting } from "./Utils";
import EmailService from "./EmailService";




/**
 * Handles all AMS specific actions when called by the Router.
 * 
 * @author Stewart McGown
 * @see https://drive.google.com/open?id=1nkLn0BRqyT5ZotY4YFy-L_2w5WFMvFJZsgGdFQlqSRU
 */
export default class AMS {
  constructor() {

  }

  /**
   * Use these static members to get the name the sheet you need
   */
  static get baseAuthSheet() { return "Editor Logins" }
  static get keySheet() { return "Article Management 2 Keys Distributed" }
  static get authTokenSheet() { return "Article Management 2 Authentication Internals" }
  static get articleDatabase() { return "Article Database (Testing)" }

  /**
   * Completely handles the creation of a single article.
   * 
   * 1. First, the article is processed to check for any missing
   * information. If there is any, it will attempt to fix that.
   * 
   * 2. Next, the article is added to the Google Drive.
   * 
   * 3. The article's information is added to the database.
   * 
   * 4. Emails relating to the article are sent.
   * 
   * @param {Article} article 
   */
  static createArticle(article) {

  }

  /**
   * Updates an article in the database with the given properties.
   * 
   * This is a general update, so general update email will be sent.
   * 
   * @param {String} ID id of article to update
   * @param {Object} properties prop
   */
  static updateArticle(data) {
    if (!data.identifiers || !data.properties) throw new Error('Missing arguments @ updateArticle')

    let identifiers = data.identifiers, properties = data.properties

    let article = SheetUtils.getMatchingRowsFromSheet(AMS.articleDatabase, identifiers)[0]

    if (!article)
      return new Response({
        message: "Article not found",
        id: identifiers
      })

    assignExisting(article, properties)

    let rowData = []
    Object.keys(article).forEach(k => rowData.push(article[k]))

    SheetUtils.updateMatchingRow(identifiers, rowData, AMS.articleDatabase)

    let updatedArticle = new Article(article)
    
    // Update the author
    EmailService.send({
      to: [updatedArticle.author.email],
      type: "update",

    })

    // notify the editor

    return new Response({
      message: `Successfully updated ${article.articleTitle}`
    })
  }


  /**
   * 
   * @param {Article} article 
   */
  static deleteArticle(article) {

  }

  /**
   * 
   * @param {Editor} editor 
   */
  static createEditor(editor) {

  }

  /**
   * 
   * @param {Editor} editor 
   * @param {Object} properties 
   */
  static updateEditor(editor, properties) {

  }

  /**
   * @return {Array.<Article>} all articles in JSON format
   */
  static getAllArticles() {
    return SheetUtils.getSheetAsJSON(AMS.articleDatabase)
      .map((a) => new Article(a))
  }

  /**
   * @param {String} id 
   * @return {Array} rows matching the ID
   */
  static getInfo(id) {
    return SheetUtils.getMatchingRowsFromSheet(id)
  }

  /**
   * Search all parts of the API for a given query.
   * @param {String} query 
   */
  static doSearch(query) {
    let collected = []

  }
}

class AMSSheetUtilsWrapper {
  static getArticleById(id) {
    const data = SheetUtils.getSheetAsJSON(AMS.articleDatabase)
    const rows = data.filter(r => r.ID == id)
    if (!rows) return null
    else if (rows[0]) return new Article(rows[0])
    else return null
  }

}

/**
 *
 */
export class Response {
  /**
   * 
   * @param {Object} data 
   * @param {String} message
   */
  constructor(data) {
    this.message = data.message
  }
}