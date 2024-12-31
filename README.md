# React スタータープラグイン

このプラグインは、React を使用して PremierePro プラグインを構築する際に始めるのに適した場所です。必要なすべての依存関係が定義されています。これは React プロジェクトであるため、PremierePro で使用可能にする前にいくつかの初期設定が必要です。

## 依存関係のインストール

まず、システムに`npm`がインストールされていることを確認してください。

このプロジェクトのルートにターミナルがあることを確認した後、`npm`を使用して必要な依存関係をインストールします：

```
npm install
```

`yarn`を使用したい場合は、`package-lock.json`ファイルを生成した後、次の行を実行して依存関係を`yarn.lock`ファイルにインポートできます：

```
yarn import
```

## ビルドプロセス

PremierePro で使用するためにプラグインをビルドする方法は 2 つあります：

- `yarn watch`（または`npm watch`）は、プラグインの開発バージョンをビルドし、ソースファイルに変更を加えるたびに再コンパイルします。結果は`dist`フォルダに配置されます。
- `yarn build`（または`npm build`）は、プラグインのプロダクションバージョンをビルドし、`dist`フォルダに配置します。ソースファイルに変更を加えるたびに更新されることはありません。

> PremierePro で使用する前に、必ず`watch`または`build`を実行してください！

## PremierePro での起動

UXP Developer Tools を使用して、プラグインを PremierePro にロードできます。

プラグインがまだ UXP Developer Tools のワークスペースに追加されていない場合は、「Add Plugin...」をクリックして追加できます。`dist`フォルダまたは`plugin`フォルダの`manifest.json`ファイルを追加できます。

- `plugin`フォルダのものを追加する場合は、•••ボタン > "Options" > "Advanced" > "Plugin build folder"をクリックして、プラグインビルドフォルダ（`dist`）への相対パスを更新する必要があります。
- 開発中は、`yarn watch`を使用してプラグインをビルドし、（プラグインビルド）`dist`フォルダの`manifest.json`をロードすることをお勧めします。

追加されたら、対応する行の•••ボタンをクリックし、「Load」をクリックして PremierePro にロードできます。PremierePro に切り替えると、スターターパネルが表示されるはずです。

## このプラグインが行うこと

このプラグインは多くのことを行いませんが、`entrypoints.setup`を使用して PremierePro に 2 つのパネルを作成する方法と、フライアウトメニューを作成する方法を示しています。また、プライマリパネルで簡単なカラーピッカーを作成するためにいくつかの Spectrum UXP ウィジェットを使用する方法も示しています。

## ガイドライン

- WebView を使用するには、マニフェストバージョン 5 以上が必要です。
- webview.domains は"all"または"string[]"です。"string[]"の場合、ワイルドカード（トップレベルを除く）がサポートされています。セキュリティの問題のため、UXP は"all"よりも"string[]"を推奨しています。例：[ "https://*.adobe.com", "https://www.google.com" ]
- webview.enableMesageBridge（オプション） - "no", "localOnly", "localAndRemote"。

### よくある問題

`npm install`でエラーが発生した場合、プロジェクトの依存関係を再インストールできます。まず、`template`フォルダから`node_modules/*`を削除し、`package-lock.json`と`yarn.lock`ファイルを削除してください。`template`ディレクトリに留まり、再度`npm install`を実行すると、`package-lock.json`ファイルが再生成されます。

Premiere Pro バージョン : 23.0.0 以上
UXP バージョン : 5.6 以上
