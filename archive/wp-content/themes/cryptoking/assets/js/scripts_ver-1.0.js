var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");
/*===================================
Author       : KlbTheme (Sinan ISIK).
Template Name: Cryptoking - Bitcoin & ICO Cryptocurrency Landing Page WordPress Theme
Version      : 1.1
===================================*/

/*===================================*
LANDING PAGE JS
*===================================*/

jQuery.noConflict();
(function($) {
	'use strict';
	
	//Run function when document ready
	$(document).ready(function () {
		init_scroll();
		init_hidenavbar();
		init_navbartoggler();
		init_dropdonnmenu();
		init_magnificvideo();
		init_scrollup();
		init_contentpopup();
		init_klbclass();
		init_popupforms();	 
		init_labeltoplace();	 
	});
	
	/*===================================*
	01. LOADING JS
	/*===================================*/
	
	$(window).on('load', function() {
		var preLoder = $(".preloader");
		preLoder.delay(700).fadeOut(500);
	});

	
	/*===================================*
	02. SCROLLUP JS
	*===================================*/
	
	$(window).scroll(function() {
		if ($(this).scrollTop() > 150) {
			$('.scrollup').fadeIn();
		} else {
			$('.scrollup').fadeOut();
		}
	});
	
	/*===================================*
	03. SMOOTH SCROLLING JS
	*===================================*/
	// Select all links with hashes
	function init_scroll() {
		$('a.page-scroll').on('click', function(event) {
			// On-page links
			if ( location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname ) {
			  // Figure out element to scroll to
			  var target = $(this.hash),
				  speed= $(this).data("speed") || 800;
				  target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

			  // Does a scroll target exist?
			  if (target.length) {
				// Only prevent default if animation is actually gonna happen
				event.preventDefault();
				$('html, body').animate({
				  scrollTop: target.offset().top - 60
				}, speed);
			  }
			}
		});
	}
	
	/*===================================*
	04. Hide Navbar Dropdown After Click On Links
	*===================================*/
	function init_hidenavbar() {
		var navBar = $(".header_wrap");
		var navbarLinks = navBar.find(".navbar-collapse ul li a");

		$.each( navbarLinks, function( i, val ) {

		  var navbarLink = $(this);

			navbarLink.on('click', function () {
			  navBar.find(".navbar-collapse").collapse('hide');
			});

		});
	}
	
	/*===================================*
	05. Dropdown Menu
	*===================================*/
	function init_dropdonnmenu() {
		$( '.dropdown-menu a.dropdown-toggle' ).on( 'click', function ( e ) {
			var $el = $( this );
			var $parent = $( this ).offsetParent( ".dropdown-menu" );
			if ( !$( this ).next().hasClass( 'show' ) ) {
				$( this ).parents( '.dropdown-menu' ).first().find( '.show' ).removeClass( "show" );
			}
			var $subMenu = $( this ).next( ".dropdown-menu" );
			$subMenu.toggleClass( 'show' );
			
			$( this ).parent( "li" ).toggleClass( 'show' );
	
			$( this ).parents( 'li.nav-item.dropdown.show' ).on( 'hidden.bs.dropdown', function ( e ) {
				$( '.dropdown-menu .show' ).removeClass( "show" );
			} );
			
			 if ( !$parent.parent().hasClass( 'navbar-nav' ) ) {
				$el.next().css( { "top": $el[0].offsetTop, "left": $parent.outerWidth() - 4 } );
			}
	
			return false;
		} );
	}
	
	/*===================================*
	06. Navbar Toggler
	*===================================*/
	function init_navbartoggler() {
		$('.navbar-toggler').on('click', function() {
			$("header").toggleClass("active");
		});
	}

	
	/*===================================*
	 07. VIDEO JS
	*===================================*/
	function init_magnificvideo() {
		$('.video').magnificPopup({
			type: 'iframe'
		});
	}
	
	/*===================================*
	 08. Scroll Up
	*===================================*/
	function init_scrollup() {
		$(".scrollup").on('click', function (e) {
			e.preventDefault();
			$('html, body').animate({
				scrollTop: 0
			}, 600);
			return false;
		});
	}
	
	
	/*===================================*
	9. POPUP JS
	*===================================*/
	function init_contentpopup() {
		$('.content-popup').magnificPopup({
			type: 'inline',
			preloader: true,
			mainClass: 'mfp-zoom'
		});
	}
	
	/*===================================*
	10. Klb Class
	*===================================*/
	function init_klbclass() {
		$(".faq_content .card .card-header h4 a").addClass( "gradient_box" );
		$("form.wpcf7-form").addClass( "form_field" );
		$("form.wpcf7-form input[type='text'], form.wpcf7-form textarea, form.wpcf7-form input[type='email']").addClass( "form-control" );
		$("form.wpcf7-form input[name='your-name'], form.wpcf7-form input[type='email']" ).closest('p').wrap( "<div class='form-group col-md-6'></div>" );
		$("form.wpcf7-form input[name='your-subject']" ).closest('p').wrap( "<div class='form-group col-md-12'></div>" );
		$("form.wpcf7-form textarea" ).closest('p').wrap( "<div class='form-group col-md-12'></div>" );
		$("form.wpcf7-form input[type='submit']").addClass( "btn btn-default" );
		$("form.wpcf7-form input[type='submit']" ).wrap( "<div class='klbsubmit col-md-12'></div>" );		
		$("form.wpcf7-form div" ).wrapAll( "<div class='row'></div>" );
		
		$(".comment-form").addClass( "form_field" );
		$(".comment-form input[type='text'], .comment-form textarea, .comment-form input[type='email']").addClass( "form-control" );
		$(".comment-form input[type='submit']").addClass( "btn btn-default" );
		
		$(".post-password-form").addClass( "form_field" );
		$(".post-password-form input[type='submit']").addClass( "btn btn-default" );
		
		$(".page img.alignleft[width='160']").closest("p").addClass( "klbclear" );
	}

	/*===================================*
	11. POPUP FORMS
	*===================================*/
	function init_popupforms() {

        $(".signUpClick").on('click' , function() {  
            $('.signin-wrapper, .forgetpassword-wrapper').fadeOut(300);
            $('.signup-wrapper').delay(300).fadeIn();
        });
        
        $(".signInClick").on('click' , function() {  
            $('.forgetpassword-wrapper, .signup-wrapper').fadeOut(300);
            $('.signin-wrapper').delay(300).fadeIn();
        });
        
        $(".forgetPasswordClick").on('click' , function() { 
            $('.signup-wrapper, .signin-wrapper').fadeOut(300);
            $('.forgetpassword-wrapper').delay(300).fadeIn();
        });
        
        $(".cancelClick").on('click' , function() { 
            $('.forgetpassword-wrapper, .signup-wrapper').fadeOut(300);
            $('.signin-wrapper').delay(300).fadeIn();
        });
	}
	
	/*===================================*
	12. Label to Placeholder
	*===================================*/
	function init_labeltoplace() {
	 $(".authorize_box :input").each(function(index, elem) {
		var eId = $(elem).attr("id");
		var label = null;
		if (eId && (label = $(elem).parents("form").find("label[for="+eId+"]")).length == 1) {
			$(elem).attr("placeholder", $(label).html());
			$(label).remove();
		}
	 });
	}
	
	/*===================================*
	13. ANIMATION JS
	*===================================*/
	$(function() {
	
		function ckScrollInit(items, trigger) {
			items.each(function() {
				var ckElement = $(this),
					AnimationClass = ckElement.attr('data-animation'),
					AnimationDelay = ckElement.attr('data-animation-delay');
	
				ckElement.css({
					'-webkit-animation-delay': AnimationDelay,
					'-moz-animation-delay': AnimationDelay,
					'animation-delay': AnimationDelay
				});
	
				var ckTrigger = (trigger) ? trigger : ckElement;
	
				ckTrigger.waypoint(function() {
					ckElement.addClass("animated").css("visibility", "visible");
					ckElement.addClass('animated').addClass(AnimationClass);
				}, {
					triggerOnce: true,
					offset: '90%'
				});
			});
		}
	
		ckScrollInit($('.animation'));
		ckScrollInit($('.staggered-animation'), $('.staggered-animation-wrap'));
	
	});	
})(jQuery);
}