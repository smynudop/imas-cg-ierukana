
ImasCg.Ierukana = function () {

	var jsonData = null;

	/**
	 * SessionStorageから値を取得する。
	 * キャッシュが存在しない、またはサポートされていない場合はnullを返す。
	 * @param {string} key キャッシュキー
	 * @return {string} キャッシュされている文字列
	 */
	var getCache = function(key) {
		if (!sessionStorage) return null;
		return sessionStorage.getItem(key);
	};

	/**
	 * SessionStorageに値を設定する。
	 * サポートされていない場合は何もしない。
	 * @param {string} key キャッシュキー
	 * @param {string} item キャッシュするオブジェクト
	 */
	var setCache = function(key, item) {
		if (!sessionStorage) return;
		if ((typeof item) !== "string")
			sessionStorage.setItem(key, JSON.stringify(item));
		else
			sessionStorage.setItem(key, item);
	};

	/**
	 * 入力した名前がヒットしているか調べる
	 */
	var isMatchName = function(str, mode) {

	};

	return {

		init: function () {
			jsonData = getCache("imas-cg-ierukana");
			if (jsonData) return;

			$.get('data/idols.json').done(function(data) {
				jsonData = $.parseJSON(data); 
				setCache("nations", data);
			}).fail(function(errorData) {
				// TODO エラー処理
			});
		},

		try: function (name) {

		}
	};
}();
