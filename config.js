var config = {
    db: 'mongodb://127.0.0.1/863',
    testdb: 'mongodb://127.0.0.1/testdb',
    signed_secret: '863_secret',    //deprecated
    cookie_name: '863_express',    //deprecated
    session_related:{
        name: '863_session',
        secret: '863_secret',
        maxAge: 1000 * 60 * 60 * 24 * 30
    },
    mail:{
        service:'163',
        auth:{
            user:'mail_863_project@163.com',
            pass: '1qaz2wsx',
        }
    },
    mail_login_pass: '123456a',
    project_name: '智能终端评测系统平台',
    site_dir:'localhost:3000',

}

module.exports = config