var ImasCg = (ImasCg ? ImasCg : {});
ImasCg.Ierukana = function () {

	var COMPARE_MODE_FLAG = {
		full_name: 1,
		full_name_kana: 2,
		first_name: 4,
		first_name_kana: 8,
		last_name: 16,
		last_name_kana: 32,
	};
	var BUTTON_LABEL = {
		'gameStart': 'ゲーム開始',
		'giveUp': '降参',
	};
	var MESSAGE = {
		'gameClear': 'ゲームクリア！',
		'alreadyAnswer': 'その子はもう解答済みです。',
		'notExist': '該当する名前が見つかりません。',
	};
	var THREE_ATTRIBUTES_ARRAY = ['cu', 'co', 'pa'];
	var COLUMNS_IN_ROW = 10;

	//var jsonData = null;
	var numOfIdols = {'all': 0, 'cu': 0, 'co': 0, 'pa': 0 };
	var numOfAnswers = {'all': 0, 'cu': 0, 'co': 0, 'pa': 0 };

	var compare_mode = null;
	var difficulty = null;
	var startUnixTime = null;
	var clearCount = null;
	var lastIdolName = null;

	var getCache = function(key) {
		if (!sessionStorage) return null;
		return sessionStorage.getItem(key);
	};

	var setCache = function(key, item) {
		if (!sessionStorage) return;
		if ((typeof item) !== 'string')
			sessionStorage.setItem(key, JSON.stringify(item));
		else
			sessionStorage.setItem(key, item);
	};

	var getIdolById = function(id) {
		$.each(jsonData.idols, function(index, idol) {
			if (idol.id === id)
				return idol;
		});
		return null;
	};

	var getIdolByName = function(name, compare_flags) {
		var result = null;
		$.each(jsonData.idols, function(index, idol) {
			$.each(COMPARE_MODE_FLAG, function(key, compare_flag) {
				if (compare_flags & compare_flag) {
					if (idol[key].replace('・', '') === name) {
						result = idol;
						return;
					}
				}
			});
			if (result) return;
		});
		return result;
	};

	var numOfAllIdolsByAttribute = function (attr) {
		var cnt = 0;
		$.each(jsonData.idols, function(index, idol) {
			if (idol.attr === attr)
				cnt++;
		});
		return cnt;
	};

	var updateIdolsNum = function () {
		$('#numOfRest').text(numOfIdols['all'] - numOfAnswers['all']);
		$.each(THREE_ATTRIBUTES_ARRAY, function(index, attr) {
			$('#' + attr + '_idols span.rest').text('あと' + (numOfIdols[attr] - numOfAnswers[attr]) + '人');
		});
	};

	var giveUp = function () {
		clearInterval(clearCount);
		$('#gameStartButton').removeClass('btn-danger').addClass('btn-success').val(BUTTON_LABEL['gameStart']);
		$('#answerButton').prop('disabled', 'false');

		$.each(jsonData.idols, function(index, idol) {
			if (! idol.answered) {
				$('#' + idol.id).addClass('giveUp').text(idol.full_name);
			}
		});

		$('#gameStartButton').after('<input type="button" id="resultTweetButton" value="結果をツイート" class="btn btn-info">');
	};

	var gameClear = function () {
		alert(MESSAGE['gameClear']);

		clearInterval(clearCount);
		$('#gameStartButton').removeClass('btn-danger').addClass('btn-success').val(BUTTON_LABEL['gameStart']);
		$('#answerButton').prop('disabled', 'false');

		$('#gameStartButton').after('<input type="button" id="resultTweetButton" value="結果をツイート" class="btn btn-info">');
	};

	var gameStartCountDown = function (count) {
		$('#gameStartButton').val(count).prop('disabled', 'false');
		if (count == 0) {
			gameStart();
			return;
		} else {
			setTimeout(function() { gameStartCountDown(count - 1);}, 1000);
		}
	};

	var gameStart = function () {
		$('#gameStartButton').removeClass('btn-success').addClass('btn-danger').prop('disabled', '').val(BUTTON_LABEL['giveUp']);
		$('#answerButton').prop('disabled', '');
		startUnixTime = parseInt((new Date) / 1);
		clearCount = setInterval(function() { countUpStart(startUnixTime); }, 10);
	};

	var countUpStart = function () {
		var nextUnixTime = parseInt((new Date) / 1);
		var wTime;
		var minutes = (nextUnixTime - startUnixTime) / 60000;
		wTime = (nextUnixTime - startUnixTime) % 60000;
		var second = (wTime / 1000);

		var milliSecond = Math.floor((second * 100)) % 100;
		second = Math.floor(second);
		minutes = Math.floor(minutes);

		$('#timerArea h2').html(('00' + minutes).slice(-3) + ':' + ('0' + second).slice(-2) + ':' + ('0' + milliSecond).slice(-2));
	};

	var resultTweetButtonSubmit = function () {
		var clearTime = $('#timerArea h2').text();
		clearTime = clearTime.replace(':', "分");
		clearTime = clearTime.replace(':', "秒");

		var tweetText = '';
		if (numOfAnswers['all'] == numOfIdols['all']) {
			tweetText = "あなたは" + clearTime + "でアイドル" + numOfIdols['all'] + "人を全て言えた真・アイドルマスターです。 最後に言ったアイドルは" + lastIdolName + "です。";
		} else {
			//	forgetIdols = idolsArray[answerFlag.indexOf(0)];

			for (var i = 0; i < numOfIdols['all']; i++) {
				answerFlagCopy[i] = answerFlag[i];
			}

			for (var i = 0; i < numOfIdols['all'] - answerSum; i++) {
				incorrectArray[i] = idolsArray[answerFlagCopy.indexOf(0)];
				answerFlagCopy[answerFlagCopy.indexOf(0)] = 1;
			}
			forgetIdols = incorrectArray[Math.floor(Math.random() * (numOfIdols['all'] - answerSum))];

			tweetText = "あなたは" + clearTime + "かけて" + (numOfAnswers['all']) + "人のアイドルを言うことができました。 " + forgetIdols + "等" + (numOfIdols['all'] - numOfAnswers['all']) + "人を言えませんでした。 精進しましょう。";
		}
		var resultTweet = 'https://twitter.com/intent/tweet?hashtags=モバマスアイドル言えるかな&text='
		resultTweet = resultTweet + tweetText + "http://hoget.web.fc2.com/pokesay.html";
		window.open(encodeURI(resultTweet));
	};

	var answerButtonSubmit = function () {
		var answer = $('#answerText').val();
		answer = answer.replace('・', '');

		var idol = getIdolByName(answer, compare_mode);
		if (idol) {
			if (! idol.answered) {
				$('#' + idol.id).addClass('answered').text(idol.full_name);
				idol.answered = true;
				lastIdolName = idol.full_name;

				numOfAnswers['all'] += 1;
				numOfAnswers[idol.attr] += 1;
				updateIdolsNum();

				$('#answerText').val('');
				$('#messageArea').text('');
			} else {
				$('#messageArea').text(MESSAGE['alreadyAnswer']);
			}
		} else {
			$('#messageArea').text(MESSAGE['notExist']);
		}
	};

	var gameStartButtonSubmit = function () {
		var $btn = $('#gameStartButton');
		if ($btn.hasClass('btn-success')) {
			setDifficulty();
			$.each(THREE_ATTRIBUTES_ARRAY, function(index, attr) { initTableByAttribute(attr); });
			initTableByAttribute('cu');
			initTableByAttribute('co');
			initTableByAttribute('pa');
			$("#resultTweetButton").remove();

			$.each(numOfAnswers, function(index, value) {
				numOfAnswers[index] = 0;
			});
			updateIdolsNum();
			gameStartCountDown(3);
		} else if ($btn.hasClass('btn-danger')) {
			giveUp();
			return;
		}
	};

	var setDifficulty = function () {
		difficulty = $('input[name="difficultyRadio"]:checked').val();
		compare_mode = 0;
		switch (difficulty) {
			case 'easy':
				compare_mode = compare_mode |
					COMPARE_MODE_FLAG.first_name |
					COMPARE_MODE_FLAG.first_name_kana |
					COMPARE_MODE_FLAG.last_name |
					COMPARE_MODE_FLAG.last_name_kana;
			case 'normal':
				compare_mode = compare_mode |
					COMPARE_MODE_FLAG.full_name_kana;
			case 'hard':
				compare_mode = compare_mode |
					COMPARE_MODE_FLAG.full_name;
		}
	};

	var initTableByAttribute = function (attr) {
		var tableId = '#' + attr + '_idols';

		$(tableId + ' span.rest').text('あと' + numOfIdols[attr] + '人');
		$(tableId + ' tbody').html('');

		var $tr = $('<tr></tr>');
		var cnt = 0;
		var appendRow = function () {
			$(tableId + ' tbody').append($tr.clone());
			$tr = $('<tr></tr>');
			cnt = 0;
		};
		$.each(jsonData.idols, function(index, idol) {
			idol.answered = false;
			if (idol.attr === attr) {
				var $td = $('<td id="' + idol.id + '">&nbsp;</td>');
				$tr.append($td.clone());
				cnt++;
				if (cnt == COLUMNS_IN_ROW) {
					appendRow();
				}
			}
		});
		if (cnt != 0) {
			appendRow();
		}
	};

	return {

		init: function () {

			var innerInit = function () {
				numOfIdols['all'] = jsonData.idols.length;
				$.each(THREE_ATTRIBUTES_ARRAY, function(index, attr) {
					numOfIdols[attr] = numOfAllIdolsByAttribute(attr);
					initTableByAttribute(attr);
				});

				$('.numOfIdol').text(numOfIdols['all']);
				$('#numOfRest').text(numOfIdols['all']);

				$('#answerText').on('keypress', function(e) {
					if (e.which == 13) {
						answerButtonSubmit();
					}
				});
				$('#answerButton').on('click', function() {
					answerButtonSubmit();
				});
				$('#gameStartButton').on('click', function() {
					gameStartButtonSubmit();
				});
				$('#answerArea').on('click', '#resultTweetButton', function() {
					resultTweetButtonSubmit();
				});
			};

			innerInit();

		//	jsonData = $.parseJSON(getCache("imas-cg-ierukana"));
		//	if (!jsonData) {
		//		$.get('data/idols.json').done(function(data) {
		//			var _data = data.replace(/\r\n?/g, '');
		//			jsonData = $.parseJSON(_data); 
		//			setCache("imas-cg-ierukana", _data);
		//			innerInit();
		//		}).fail(function(errorData) {
		//			$('#messageArea').text('データ読み込みエラー');
		//		});
		//	} else {
		//		innerInit();
		//	}
		}

	};
}();
