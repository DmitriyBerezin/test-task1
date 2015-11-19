
'use strict';

// Текущая реализация не может гарантировать определенную
// последовательность загрузки модулей. Эту строчку можно рассматривать как хак.
ForexApp.init();

// В нашем случае все скрипты прописаны перед закрывающимся тэгом body.
// Соответственно это гаранирует, что DOM уже полностью загружен, и использование jQuery.ready 
// является в данном случае избыточным. Однако, это хороший стиль, гарантирующий корректную работу
// скрипта в любых условиях.
$(function () {
	var $socialBlock = $('.social-block'),
		hideSocialBlock = !!ForexApp.Settings.getGlobalSettings(ForexApp.Consts.HIDE_SOCIAL_BLOCK);

	if (!hideSocialBlock) {
		$('.social-block').find('.dismiss-icon').click(onSocialDismissClick);

		$socialBlock.show(500);
	}

	ForexApp.UI.runTimer();

	ForexApp.UI.updateMembersCount();

	
	function onSocialDismissClick(evt) {
		$socialBlock.hide(500);

		ForexApp.Settings.setGlobalSettigs(ForexApp.Consts.HIDE_SOCIAL_BLOCK, 1);
	}
});
