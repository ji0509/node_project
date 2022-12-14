const config = require('$Common/config');
const common = require('$Common/common');

async function run(oracledb, obj) {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: config.user,
      password: config.password,
      connectString: config.connectString
    });
    oracledb.autoCommit = true;

    let binds = {
      orgcd : obj.uInfo[1],
      userid : obj.uInfo[0],
    };

    let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    };
    
    let query = `
    SELECT 
      --ORG_CD,
      HEADERNAME AS "headerName",
      HEADERALIGN AS "headerAlign",
      "TYPE" AS "type",
      WIDTH AS "width",
      ALIGN AS "align",
      FIELD AS "field",
      PAGE AS "page",
      SORT AS "sort",
      VISIABLE AS "visiable",
      CATEGORY AS "category"
      --USER_ID
    FROM TB_SYS_DOMAIN_NEW 
    WHERE ORG_CD = :orgcd AND USER_ID = :userid
    ORDER BY ORG_CD ASC, CATEGORY DESC, SORT ASC
    `

    let debugQuery = require('bind-sql-string').queryBindToString(query, binds, { quoteEscaper: "''" });
    common.logger('info', `query debug => ${debugQuery}`);

    result = await connection.execute(query, binds, options);
    
    let rst = result.rows;
    //console.log(rst)
    return rst;
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
module.exports.run = run;

