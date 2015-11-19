
'use strict';

var ForexApp = ForexApp || {};

ForexApp.UI = (function (module) {
	var numberFormatRegex = /(\d+)(\d{3})/;

	// Private functions
	function runTimer() {
		var daysDic = ['день', 'дня', 'дней'],
			hoursDic = ['час', 'часа', 'часов'],
			minutesDic = ['минута', 'минуты', 'минут'],
			secondsDic = ['секунда', 'секунды', 'секунд'],

			$timerCtrl = $('.timer-control'),

			digitHtml = '<div class="jt-digit"></div>',
			
			// Конечно, лучше здесь исползовать какой-нибудь шаблонизатор
			html = [
				'<div class="jt-chunk jt-day-chunk">',
					digitHtml,
					digitHtml,
					'<div class="jt-chunk-title">&nbsp;</div>',
				'</div>',
				'<div class="jt-chunk jt-hour-chunk">',
					digitHtml,
					digitHtml,
					'<div class="jt-chunk-title">&nbsp;</div>',
				'</div>',
				'<div class="jt-chunk jt-separator-chunk">',
					'<div class="jt-separator">:</div>',
					'<div class="jt-chunk-title">&nbsp;</div>',
				'</div>',
				'<div class="jt-chunk jt-min-chunk">',
					digitHtml,
					digitHtml,
					'<div class="jt-chunk-title">&nbsp;</div>',
				'</div>',
				'<div class="jt-chunk jt-separator-chunk">',
					'<div class="jt-separator">:</div>',
					'<div class="jt-chunk-title">&nbsp;</div>',
				'</div>',
				'<div class="jt-chunk jt-sec-chunk">',
					digitHtml,
					digitHtml,
					'<div class="jt-chunk-title">&nbsp;</div>',
				'</div>'
			].join(''),
			
			options = {
				template: html,
				direction: $.fn.uiTimer.direction.BACKWARD,
				startPoint: {
					days: 2,
					hours: 20,
					minutes: 55,
					seconds: 12
				}
			};

		$timerCtrl
			.uiTimer(options)
			.uiTimer('start')
			.on('uitimer-tick', onTimerTick)
			.on('uitimer-finished', onTimerFinished);

		function onTimerTick(evt, point) {
			$timerCtrl.find('.jt-day-chunk').find('.jt-chunk-title').html(
				ForexApp.Utils.getWordForm(point.days, daysDic)
			);
			$timerCtrl.find('.jt-hour-chunk').find('.jt-chunk-title').html(
				ForexApp.Utils.getWordForm(point.hours, hoursDic)
			);
			$timerCtrl.find('.jt-min-chunk').find('.jt-chunk-title').html(
				ForexApp.Utils.getWordForm(point.minutes, minutesDic)
			);
			$timerCtrl.find('.jt-sec-chunk').find('.jt-chunk-title').html(
				ForexApp.Utils.getWordForm(point.seconds, secondsDic)
			);
		}

		function onTimerFinished(evt) {
			alert('Ура! Розыгрыш начался!!!');
		}
	}

	function updateMembersCount(value) {
		value = value || ForexApp.membersCount;

		$('.members-count').html(ForexApp.Utils.formatNumber(value));
		$('.members-count-word').html(ForexApp.Utils.getWordForm(value, ['билет', 'билета', 'билетов']));

		ForexApp.Settings.setSessionSettings(ForexApp.Consts.MEMBERS_COUNT, value);
	}

	// Public API
	module.runTimer = runTimer;
	module.updateMembersCount = updateMembersCount;

	return module;
}(ForexApp.UI || {}));