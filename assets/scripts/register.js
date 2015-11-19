
'use strict';

ForexApp.init();

$(function () {
	var $regForm = $(".registration-form"),
		$fxBankLogin = $regForm.find('#fxBankLogin');

	ForexApp.UI.updateMembersCount();

	ForexApp.UI.runTimer();

	// Валидация формы регистрации
	$.validator.addMethod('phone', function (value, element, params) {
		return /[0-9]{10}/.test(value) && value.length === 10;
	});

	$.extend($.validator.messages, {
		required: 'Данное поле ялвяется обязательным',
		email: 'Введенный почтовый адрес некорректен',
		phone: 'Телефонный номер состоит из 10 цифр'
	});

	$regForm.validate({
		rules: {
			phone: "phone",
		},
		errorElement: 'div',
		errorClass: 'error',
		errorPlacement: function (error, element) {
			var elemName = element.attr('name'),
				$phoneTipsGroup;

			if (elemName === 'phone-country' || elemName === 'phone') {
				$phoneTipsGroup = $('.phone-tips-group');
				if ($phoneTipsGroup.find('div.error:visible').length === 0) {
					$phoneTipsGroup.append(error);
				}
			}
			else if (elemName === 'fxBankLogin') {
				$('.bank-tip-block').after(error);
			}
			else {
 				element.after(error);
			}
		}
	});


	// Отправка формы регистрации
	$regForm.ajaxForm({
		beforeSubmit: onBeforeSubmit,
		success: onRegistrationSuccess,
		error: onRegistrationError
	})

	function onBeforeSubmit(data, $form, options) {
		// Проверяем, что пользователь с заданным fxBankLogin уже регистрировался
		if (ForexApp.Settings.getSessionSettings($fxBankLogin.val())) {
			alert('Регистрация с указанным логином уже производилась!');
			return false;
		}

		return true;
	}

	function onRegistrationSuccess(responseText, statusText, xhr) {
		var fxLogin = $fxBankLogin.val();

		alert('Поздравляем! Вы успешно зарегистрировались в конкурсе!');

		// Сохраняем признак того, что пользователь с заданным
		// fxLogin уже зарегистрирован.
		ForexApp.Settings.setSessionSettings(fxLogin, 1);

		// Увеличиваем и сохраняем кол-во участников
		ForexApp.Settings.setSessionSettings(ForexApp.Consts.MEMBERS_COUNT, ++ForexApp.membersCount);

		// Изменяем кол-во участников на текущей и...
		ForexApp.UI.updateMembersCount(ForexApp.membersCount);

		// ...на главной странице
		if (window.opener) {
			window.opener.ForexApp.UI.updateMembersCount(ForexApp.membersCount);
		}
	}

	function onRegistrationError(error) {
		alert('При регистрации произошла ошибка: ' + error);
	}
});