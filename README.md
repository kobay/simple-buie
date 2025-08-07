
# 使い方


## Box App の設定

- ユーザー認証アプリ（標準OAUTH2.0）を作成する
- 適切なスコープを設定する
- リダイレクトURIに、`http://localhost:3000/callback` をセットする
- CORSドメインに、`http://localhost:3000` をセットする
- 有効化が必須になっている場合、管理者でこのアプリを有効化する


## コード

- このコードをローカルPCにgit clone する
- `env.sample` をコピーし、`.env` ファイルを作成する(先頭にドットが付く)
- ファイルを開き、CLIENT_IDとCLIENT_SECRETを、作成したアプリ設定のものにかえる


## コマンド

- `npm dev` : typescriptコードのままプログラムを実行する
- `npm build`: typescriptコードをコンパイルして、jsファイルを作成する
- `npm start`: node.jsで、`npm build`で作成したjsファイルを実行する



