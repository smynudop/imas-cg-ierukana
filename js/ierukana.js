
ImasCg.Ierukana = function () {

	var answer_mode_enum = {
		full_name: 1,
		full_name_kana: 2,
		first_name: 4,
		first_name_kana: 8,
		last_name: 16,
		last_name_kana: 32,
	};

	var jsonData = null;
	var answer_mode = null;

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
	 * @param {string} str 入力したテキスト
	 * @param {number} mode answer_mode_enum のうち必要な値をORした値
	 * @return ヒットしたアイドルのID
	 */
	var isMatchName = function(str, mode) {
		$.each(jsonData, function(index, data) {
			$.each(answer_mode_enum, function(key, value) {
				if (mode & value) {
					if (data[key] === str)
						return data.id;
				}
			});
		});
		return 0;
	};

	return {

		/**
		 * 初期化処理
		 */
		init: function () {
			jsonData = getCache("imas-cg-ierukana");
			if (jsonData) return;

			$.get('data/idols.json').done(function(data) {
				jsonData = $.parseJSON(data); 
				setCache("imas-cg-ierukana", data);
			}).fail(function(errorData) {
				// TODO エラー処理
			});
		},

		/**
		 * ゲーム開始ボタン押下時の処理
		 */
		game_start: function (mode) {
			// タイマーカウント開始
		},

		/**
		 * ゲーム終了ボタン押下時の処理
		 */
		game_end: function () {
			// タイマーカウント終了
		},

		/**
		 * 解答ボタン押下時の処理
		 */
		answer: function (name) {
			var id = isMatchName(name, answer_mode);
			if (id) {
				// ヒットした時、該当アイドル名をオープン
			} else {
				// ヒットしない時は警告を出す？
			}
		},

	};
}();
