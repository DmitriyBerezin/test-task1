
'use strict';

// DOM стуктура элемента плагина должна иметь
// следуюшие элементы:
// 		- .jt-day-chunk - контейнер для дней
// 		- .jt-hour-chunk - контейнер для часов
// 		- .jt-min-chunk - контейнер для минут
// 		- .jt-sec-chunk - контейнер для секунд
// Внутри этих контейнеров должны быть 2 контейнера для цифр .jt-digit
// Мы не настолько эгоэстичные как Bootstrap,
// поэтому все классы плагина будут иметь префикс
// jt (jquery timer) 
(function ($) {
	// Private variables

	// Private methods
	function render(elem, point, template) {
		elem.html(template);

		updateHtml(elem, point);
	}

	function updateHtml(elem, point) {
		setChunkValue(elem.find('.jt-day-chunk'), point.days);
		setChunkValue(elem.find('.jt-hour-chunk'), point.hours);
		setChunkValue(elem.find('.jt-min-chunk'), point.minutes);
		setChunkValue(elem.find('.jt-sec-chunk'), point.seconds);
	}

	// Устанавливает значение для блока секунд, минут и т.д.
	function setChunkValue(chunk, val) {
		function setDigitValue(digit, val) {
			digit.html(parseInt(val, 10));
		}

		var $digits = chunk.find('.jt-digit');

		val = val.toString();
		if (val.length === 1) {
			val = '0' + val;
		}

		setDigitValue($digits.eq(0), val.charAt(0));
		setDigitValue($digits.eq(1), val.charAt(1));
	}

	// Применение шага таймера
	// Проверки на валидность единиц времени и 
	// автоматический поразрядный переход разрядов
	function tick(data) {
		var quotient = 0, // делимое для корректировки старшего разряда
			remainder = 0; // остаток для корректировки текущего разряда

		if (!data.point) {
			data.point = $.extend({}, data.opts.startPoint);
		}

		if (data.opts.direction === $.fn.uiTimer.direction.FORWARD) {
			data.point.seconds += data.opts.interval;
			
			quotient = Math.floor(data.point.seconds / 60);
			remainder = data.point.seconds % 60;
			if (quotient > 0) {
				data.point.seconds = remainder;
				data.point.minutes += quotient;

				quotient = Math.floor(data.point.minutes / 60);
				remainder = data.point.minutes % 60;
				if (quotient > 0) {
					data.point.minutes = remainder;
					data.point.hours += quotient;

					quotient = Math.floor(data.point.hours / 24);
					remainder = data.point.hours % 24;
					if (quotient > 0) {
						data.point.hours = remainder;
						data.point.days += quotient;
					}
				}
			}
		}
		else if (data.opts.direction === $.fn.uiTimer.direction.BACKWARD) {
			data.point.seconds -= data.opts.interval;
			
			quotient = Math.floor(data.point.seconds / 60);
			remainder = data.point.seconds % 60;
			if (remainder < 0) {
				data.point.seconds = 60 + remainder;
				data.point.minutes += quotient;

				quotient = Math.floor(data.point.minutes / 60);
				remainder = data.point.minutes % 60;
				if (remainder < 0) {
					data.point.minutes = 60 + remainder;
					data.point.hours += quotient;

					quotient = Math.floor(data.point.hours / 24);
					remainder = data.point.hours % 24;
					if (remainder < 0) {
						data.point.hours = 24 + remainder;
						if (data.point.days > 0) {
							data.point.days += quotient;
						}
						else {
							// Стоп, не уходим в минус
							data.point = {
								days: 0,
								hours: 0,
								minutes: 0,
								seconds: 0
							};

							methods.stop.apply(this, []);

							this.trigger('uitimer-finished');
						}
					}
				}
			}
		}
		
		// Перерисовываем таймер
		updateHtml(this, data.point);

		// Сохраняем измененное состояние временной точки
		this.data('uiTimer', data);

		this.trigger('uitimer-tick', data.point);
	}
	
	
	// Public API
	var methods = {
		// Инитиализация
		init: function(options) {
			var opts = $.extend({}, $.fn.uiTimer.defaults, options);

			return this.each(function() {
				var $this = $(this);

				// jQueryUI library practice
				// Сохраняем настройки. Таким же образом
				// потом сохраняется текущее состояние
				$(this).data('uiTimer', { opts: opts });

				if (typeof opts.template === 'string') {
					render($this, opts.startPoint, opts.template);
				}
			});
		},

		// Запуск таймера
		start: function() {
			return this.each(function() {
				var $this = $(this),
					data = $this.data('uiTimer'),
					this_tick = tick.bind($this, data);

				if (!data.intervalID) {
					data.intervalID = setInterval(this_tick, data.opts.interval * 1000);
					$(this).data('uiTimer', data);
				}
			});
		},

		// Принудительная остановка таймера
		stop: function() {
			return this.each(function() {
				var $this = $(this),
					data = $this.data('uiTimer');

				if (data.intervalID) {
					clearInterval(data.intervalID);
					data.intervalID = null;
					$(this).data('uiTimer', data);
				}
			});	
		}
	};

	
	// Plugin
	$.fn.uiTimer = function(method) {
		if (typeof methods[method] === 'function') {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Метод с именем ' +  method + ' не зарегистрирован для jQuery.uiTimer')
		}
	};

	
	// Consts
	$.fn.uiTimer.direction = {
		FORWARD: 'forward',
		BACKWARD: 'backward'
	};

	
	// Заводские настройки
	$.fn.uiTimer.defaults = {
		template: undefined,
		direction: $.fn.uiTimer.direction.FORWARD,
		startPoint: {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 10
		}, // начальная точка отсчета
		interval: 1 // in seconds
	};

}( jQuery ));