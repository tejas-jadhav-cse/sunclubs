// for preloader (dont remove)



// this function will add the link to the every apply now just add the class or id to the button
$(document).ready(function () {
    // Retrieve a specific cookie value by name
    function getCookieValue(name) {
        const cookiePattern = new RegExp('(^| )' + name + '=([^;]+)');
        const match = document.cookie.match(cookiePattern);
        return match ? match[2] : null;
    }

    // Function to append UTM parameters to a link
    function addUtmToLink(targets) {
        console.log("adding utm param")
        const utmParams = [];
        const utmSource = getCookieValue("utm_source");
        const utmMedium = getCookieValue("utm_medium");
        const utmCampaign = getCookieValue("utm_campaign");
        const utmTerm = getCookieValue("utm_term");
        const utmContent = getCookieValue("utm_content");

        if (utmSource) utmParams.push(`utm_source=${utmSource}`);
        if (utmMedium) utmParams.push(`utm_medium=${utmMedium}`);
        if (utmCampaign) utmParams.push(`utm_campaign=${utmCampaign}`);
        if (utmTerm) utmParams.push(`utm_term=${utmTerm}`);
        if (utmContent) utmParams.push(`utm_content=${utmContent}`);

        const fullUtmUrl = getCookieValue("full_utm_url");
        let fullQueryString = utmParams.join("&");

        if (fullUtmUrl) {
            const separator = fullQueryString ? '&' : '';
            fullQueryString += `${separator}${fullUtmUrl}`;
        }

        // Iterate over the target elements and update their href attributes
        targets.forEach(({ targetName, type }) => {
            const selector = type === "id" ? `#${targetName}` : `.${targetName}`;
            const linkElement = $(selector);

            if (linkElement.length) {
                const originalHref = linkElement.attr("href");
                const newHref = `${originalHref}?${fullQueryString}`;
                linkElement.attr("href", newHref);
                console.log(`Updated href for ${selector}: ${newHref}`);
            }
        });
    }

    // Define the array of target objects
    const targets = [
        { targetName: "ApplyNowLink_PGP_TBM", type: "id" },
        { targetName: "ApplyNowLink_PGP_TBM16month", type: "id" },
        { targetName: "ApplyNowLink_PGP_TBM24month", type: "id" },
        { targetName: "ApplyNowLink_PGP_TBM2", type: "id" },
        { targetName: "ApplyNowLink_PGP_TBM3", type: "id" },
        { targetName: "ApplyNowLink_PGP_TBMCID1", type: "id" },
        { targetName: "ApplyNowLink_PGP_TBMCIDYLC", type: "id" },
        { targetName: "applyNowLinkUG_TBM", type: "id" },
        { targetName: "applyNowLinkUG_TBM", type: "class" },
        { targetName: "applyNowLinkUG_TBM2", type: "id" },
        { targetName: "applyNowLinkUG_UG_AI1", type: "id" },
        { targetName: "ApplyNowLinklUG_PsychologyAndMarketing", type: "id" },
        { targetName: "ApplyNowLinklUG_PsychologyAndMarketing2", type: "id" },
        { targetName: "applyNowLink_CMTClass_DontRemove", type: "id" },
        { targetName: "ApplyNowLinklUG_PsychologyAndMarketing3", type: "id" },
        { targetName: "applyNowLinkPGP_rise_genral_management", type: "class" },
        { targetName: "applyNowLinkPGP_rise_family_business_transformation", type: "class" },
        { targetName: "applyNowLinkPGP_rise_genral_management_MENA", type: "class" },
        { targetName: "applyNowLink_afterDownladPlacementPopUpClass_DontRemove", type: "class" },
        { targetName: "applyNowLink_PgpTbmFBLMClass_DontRemove", type: "class" },
        { targetName: "_DSAIApplyNowBtn", type: "class" },
        // { targetName: "exampleClassLink", type: "class" },
        // Add more objects as needed
    ];

    // Add UTM parameters to links when the page loads
    addUtmToLink(targets);
});



document.addEventListener("DOMContentLoaded", () => {
    const firstWrapper = document.querySelector(".first");
    const wrappers = document.querySelectorAll(".learnBelowWrapper:not(.first)");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("rounded-top");
            } else {
                entry.target.classList.remove("rounded-top");
            }
        });
    }, {
        root: null,
        threshold: 0.5
    });

    wrappers.forEach(wrapper => observer.observe(wrapper));
});



function isElementInViewport($el) {
    const rect = $el[0].getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

$(document).ready(function () {
    $('.faqquestionWraps .faqanswers').not(':first').slideUp();
    $('.faqquestionWraps ').off('click').on('click', function (event) {
        event.stopPropagation(); // Prevent event from propagating up the DOM tree
        let id = $(this).attr('data-rel');
        $(this).toggleClass('active').siblings().removeClass('active');
        $('#' + id).slideToggle().parent().siblings().find('.faqanswers').slideUp();
    });
});

// Function to add the "visible" class to the element when it is in the viewport
function addClassOnScroll() {
    const $element = $(".journeyStarts"); // Replace with the selector of your element

    $element.each(function () {
        if (isElementInViewport($(this))) {
            $(this).addClass("visible");
        } else {
            $(this).removeClass("visible");
        }
    });
}

function addClassOnScroll2() {
    const $element2 = $(".founderCXO"); // Replace with the selector of your element

    $element2.each(function () {
        if (isElementInViewport($(this))) {
            $(this).addClass("visible");
        } else {
            $(this).removeClass("visible");
        }
    });
}

function addClassOnScroll3() {
    const $element3 = $(".placementBox"); // Replace with the selector of your element

    $element3.each(function () {
        if (isElementInViewport($(this))) {
            $(".placementLeft").addClass("");
        } else {
            $(".placementLeft").removeClass("");
        }
    });
}

// Event listener to call the addClassOnScroll function when the page is scrolled
$(window).on("scroll", addClassOnScroll);
$(window).on("scroll", addClassOnScroll2);
$(window).on("scroll", addClassOnScroll3);

// Call the function on page load to check if the element is already visible
addClassOnScroll();
addClassOnScroll2();

// menu scroller

$(document).ready(function () {
    const currentPath = window.location.pathname;

    const deviceWidth = window.innerWidth;
    if (deviceWidth >= 768 && deviceWidth <= 822) return;

    if (
        currentPath === "/for-companies" ||
        currentPath === "/jobs" ||
        currentPath === "/events" ||
        currentPath === "/become-a-master"
    ) return;

    var lastScrollTop = 0;
    var $menu = $("header");
    var menuHeight = $menu.height() - 60;
    var windowHeight = $(window).height();
    var sectionHeight = $(".highlightsec").height();
    var documentHeight = $(document).scrollTop();

    $(window).scroll(function () {
        var st = $(this).scrollTop();

        if ($(".highlightsec").length > 0) {
            if (st < $(".highlightsec").height()) {
                if (st > lastScrollTop) {
                    // Scrolling down
                    if (st > menuHeight && st + windowHeight < $(document).height()) {
                        $menu.css("top", -menuHeight + "px");
                        $menu.addClass("shrikIt");
                    }
                } else {
                    // Scrolling up
                    if (st <= 0) {
                        // Only remove shrikIt if at the very top
                        $menu.css("top", "0");
                        $menu.removeClass("shrikIt");
                    }
                }
                lastScrollTop = st;
            }
        } else {
            if (st > lastScrollTop) {
                // Scrolling down
                if (st > menuHeight && st + windowHeight < $(document).height()) {
                    $menu.css("top", -menuHeight + "px");
                    $menu.addClass("shrikIt");
                }
            } else {
                // Scrolling up
                if (st <= 0) {
                    $menu.css("top", "0");
                    $menu.removeClass("shrikIt");
                }
            }
            lastScrollTop = st;
        }
    });

    if (documentHeight > sectionHeight) {
        $menu.css("top", -menuHeight + "px");
        $menu.addClass("darkHeader");
    }
});


// js tabs

// (function () {
//   var g = document,
//     tabs = g.querySelector(".tabsNew"),
//     tab = g.querySelectorAll(".tabsNew li"),
//     contentNew = g.querySelectorAll(".contentNew");
//   tabs.addEventListener("click", function (f) {
//     if (f.target && f.target.nodeName === "LI") {
//       // change tabs
//       for (var j = 0; j < tab.length; j++) {
//         tab[j].classList.remove("active");
//       }
//       f.target.classList.toggle("active");

//       // change content
//       for (j = 0; j < contentNew.length; j++) {
//         contentNew[j].classList.remove("active");
//       }

//       var tabId = "#" + f.target.dataset.tabId;
//       g.querySelector(tabId).classList.toggle("active");
//     }
//   });
// })();

// js accordion

// $(document).ready(function () {
//   $(".accordion").on("click", ".heading", function () {
//     $(this).toggleClass("active").next().slideToggle();

//     $(".contents").not($(this).next()).slideUp(300);

//     $(this).siblings().removeClass("active");
//   });
// });

// scroll on click side MU learning Section

$(".courseName").click(function () {
    var tabID = $(this).attr("data-tab");

    $(this).addClass("active").siblings().removeClass("active");

    $("#animation-" + tabID)
        .addClass("active")
        .siblings()
        .removeClass("active");
});

// gradient scroll

// let hero = document.querySelector('.heroSection');
// hero.addEventListener('mousemove', z => {
//   let rect = z.target.getBoundingClientRect();
//   let x = z.clientX - rect.left;
//   let y = z.clientY - rect.top;
//   hero.style.setProperty('--x', x + 'px');
//   hero.style.setProperty('--y', y + 'px');
// });

// stepper form

var currentStep = 1;

// open and close popup

function openPopup(video) {
    console.log("video............", video);
    $("#iframevideo_MU").attr(
        "src",
        `https://www.youtube-nocookie.com/embed/${video}?rel=0&autoplay=1`
    );
    $("#heroPopup").addClass("active");
    $("body").css("overflow", "hidden");
}

function closePopup() {
    $("#iframevideo_MU").attr("src", ` `);
    $("#heroPopup").removeClass("active");
    $("body").css("overflow", "visible");
}
function openPopupYtVid(video, time) {
    console.log("video............", video, time);
    $("#iframevideo_MU").attr(
        "src",
        `https://www.youtube.com/embed/${video}?rel=0&autoplay=1&t=${time}s`
    );
    $("#heroPopup").addClass("active");
    $("body").css("overflow", "hidden");
}

function closePopup() {
    $("#iframevideo_MU").attr("src", ` `);
    $("#heroPopup").removeClass("active");
    $("body").css("overflow", "visible");
}

// enable it when to use custom video player

// function closePopupVideo() {
//   $('#heroPopup').removeClass("active");
//   $("body").css("overflow", "visible");
//   $video[0].pause();
//   $video_controls.removeClass("playing");
//   $video_container.parents(".video-header").removeClass("playing");
// }

// custom video player

$(".custom-video-area").each(function () {
    // Video
    var $video_container = $(this);
    var $video = $(this).find("#video-element");

    // Video Controls
    var $video_controls = $(this).find(".video-controls");
    var $button_controls = $(this).find(".bottom-wrapper");
    var $progress_bar = $(this).find(".progress-bar");
    var $progress = $(this).find(".time-bar");
    var $buffer_bar = $(this).find(".buffer-bar");
    var $play_button = $(this).find(".play-button");
    var $mute_button = $(this).find(".sound-button");

    var $volume_wrapper = $(this).find(".volume");
    var $volume_bar = $(this).find(".volume-bar");

    var $full_screen_btn = $(this).find(".btnFS");
    var $current = $(this).find(".current");
    var $duration = $(this).find(".duration");
    var $fast_fwd = $(this).find("#fastFwd");

    // Toggles play/pause for the video
    function playVideo() {
        if ($video[0].paused) {
            $video[0].play();
            $video_controls.addClass("playing");

            if ($video_container.parents(".video-header").length) {
                $video_container.parents(".video-header").addClass("playing");
            }
        } else {
            $video[0].pause();
            $video_controls.removeClass("playing");
            $video_container.parents(".video-header").removeClass("playing");
        }
    }

    function updateVolume(x, vol) {
        if (vol) {
            $percentage = vol * 100;
        } else {
            $position = x - $volume_wrapper.offset().left;
            $percentage = (100 * $position) / $volume_wrapper.width();
        }

        if ($percentage > 100) {
            $percentage = 100;
        }
        if ($percentage < 0) {
            $percentage = 0;
        }

        //update volume bar and video volume
        $volume_bar.css("width", $percentage + "%");
        $video[0].volume = $percentage / 100;

        if ($video[0].volume == 0) {
            $mute_button.removeClass("sound-med").addClass("sound-muted");
        } else if ($video[0].volume > 0.5) {
            $mute_button.removeClass("sound-muted").addClass("sound-med");
        } else {
            $mute_button.removeClass("sound-muted").removeClass("sound-med");
        }
    }

    function changeSpeed() {
        if ($video[0].playbackRate === 1) {
            $video[0].playbackRate = 2;
            $fast_fwd.text("2x Speed");
        } else if ($video[0].playbackRate === 2) {
            $video[0].playbackRate = 1;
            $fast_fwd.text("1x Speed");
        }
    }

    function launchFullscreen() {
        if ($video[0].requestFullscreen) {
            $video[0].requestFullscreen();
        } else if ($video[0].mozRequestFullScreen) {
            $video[0].mozRequestFullScreen();
        } else if ($video[0].webkitRequestFullscreen) {
            $video[0].webkitRequestFullscreen();
        } else if ($video[0].msRequestFullscreen) {
            $video[0].msRequestFullscreen();
        }
    }

    function time_format(seconds) {
        var m =
            Math.floor(seconds / 60) < 10
                ? "0" + Math.floor(seconds / 60)
                : Math.floor(seconds / 60);
        var s =
            Math.floor(seconds - m * 60) < 10
                ? "0" + Math.floor(seconds - m * 60)
                : Math.floor(seconds - m * 60);
        return m + ":" + s;
    }

    function startBuffer() {
        $current_buffer = $video[0].buffered.end(0);
        $max_duration = $video[0].duration;
        $perc = (100 * $current_buffer) / $max_duration;
        $buffer_bar.css("width", $perc + "%");

        if ($current_buffer < $max_duration) {
            setTimeout(startBuffer, 500);
        }
    }

    function updatebar(x) {
        $position = x - $progress.offset().left;
        $percentage = (100 * $position) / $progress_bar.width();
        if ($percentage > 100) {
            $percentage = 100;
        }
        if ($percentage < 0) {
            $percentage = 0;
        }
        $progress.css("width", $percentage + "%");
        $video[0].currentTime = ($video[0].duration * $percentage) / 100;
    }

    $video.on("loadedmetadata", function () {
        $current.text(time_format(0));
        $duration.text(time_format($video[0].duration));
        updateVolume(0, 0.7);
        setTimeout(startBuffer, 150);
    });

    // Play/pause on video click
    $video.click(function () {
        playVideo();
    });

    // Video duration timer
    $video.on("timeupdate", function () {
        $current.text(time_format($video[0].currentTime));
        $duration.text(time_format($video[0].duration));
        var currentPos = $video[0].currentTime;
        var maxduration = $video[0].duration;
        var perc = (100 * $video[0].currentTime) / $video[0].duration;
        $progress.css("width", perc + "%");
    });

    /* VIDEO CONTROLS
      ------------------------------------------------------- */

    // Hide button controls when video is playing
    $video_container.on("mouseleave", function () {
        if ($video[0].paused === false) {
            $video_container.addClass("playing");
        }
    });

    // Show button controls on hover
    $video_container.on("mouseover", function () { });

    // Play/pause on button click
    $play_button.click(function () {
        playVideo();
    });

    // Fast Forward Button
    $fast_fwd.click(function () {
        changeSpeed();
    });

    // Volume Drag
    var volumeDrag = false;
    $volume_wrapper.on("mousedown", function (e) {
        volumeDrag = true;
        $video[0].muted = false;
        $mute_button.removeClass("muted");
        updateVolume(e.pageX);
    });

    $(document).on("mouseup", function (e) {
        if (volumeDrag) {
            volumeDrag = false;
            updateVolume(e.pageX);
        }
    });

    $(document).on("mousemove", function (e) {
        if (volumeDrag) {
            updateVolume(e.pageX);
        }
    });

    // Mute video on button click
    $mute_button.click(function () {
        $video[0].muted = !$video[0].muted;
        $(this).toggleClass("sound-muted");
        if ($video[0].muted) {
            $volume_bar.css("width", 0);
        } else {
            $volume_bar.css("width", $video[0].volume * 100 + "%");
        }
    });

    // Full Screen Button
    $full_screen_btn.click(function () {
        launchFullscreen();
    });

    // VIDEO PROGRESS BAR
    //when video timebar clicked
    var timeDrag = false; /* check for drag event */
    $progress_bar.on("mousedown", function (e) {
        timeDrag = true;
        updatebar(e.pageX);
    });
    $(document).on("mouseup", function (e) {
        if (timeDrag) {
            timeDrag = false;
            updatebar(e.pageX);
        }
    });
    $(document).on("mousemove", function (e) {
        if (timeDrag) {
            updatebar(e.pageX);
        }
    });
});

// js paralax scroller
/*
$(document).ready(function () {
  // Initialize Intersection Observer
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Element is in view
        animateElement();
        observer.unobserve(entry.target);
      }
    });
  });

  // Observe the target element
  const elem = document.getElementById("adjustment");
  if (elem) {
    observer.observe(elem);
  }

});

function animateElement() {
  var previousScroll = $(window).scrollTop();
  var previousScroll1 = $(window).scrollTop();
  var previousScroll2 = $(window).scrollTop();
  var previousScroll3 = $(window).scrollTop();
  var previousScroll4 = $(window).scrollTop();
  var previousScroll5 = $(window).scrollTop();

  $(window).scroll(function () {
    var currentScroll = $(window).scrollTop();
    var currentScroll1 = $(window).scrollTop();
    var currentScroll2 = $(window).scrollTop();
    var currentScroll3 = $(window).scrollTop();
    var currentScroll4 = $(window).scrollTop();
    var currentScroll5 = $(window).scrollTop();

    var scrollDifference = currentScroll - previousScroll;
    var scrollDifference1 = currentScroll1 - previousScroll1;
    var scrollDifference2 = currentScroll2 - previousScroll2;
    var scrollDifference3 = currentScroll3 - previousScroll3;
    var scrollDifference4 = currentScroll4 - previousScroll4;
    var scrollDifference5 = currentScroll5 - previousScroll5;

    var currentTop = parseInt($("#paralx0").css("top"));
    var currentTop1 = parseInt($("#paralx1").css("top"));
    var currentTop2 = parseInt($("#paralx2").css("top"));
    var currentTop3 = parseInt($("#paralx3").css("top"));
    var currentTop4 = parseInt($("#paralx4").css("top"));
    var currentTop5 = parseInt($("#paralx5").css("top"));

    var newTop = currentTop - scrollDifference;
    var newTop1 = currentTop1 - scrollDifference1;
    var newTop2 = currentTop2 - scrollDifference2;
    var newTop3 = currentTop3 - scrollDifference3;
    var newTop4 = currentTop4 - scrollDifference4;
    var newTop5 = currentTop5 - scrollDifference5;

    $("#paralx0").css("top", newTop + "px");
    $("#paralx1").css("top", newTop1 + "px");
    $("#paralx2").css("top", newTop2 + "px");
    $("#paralx3").css("top", newTop3 + "px");
    $("#paralx4").css("top", newTop4 + "px");
    $("#paralx5").css("top", newTop5 + "px");

    previousScroll = currentScroll;
    previousScroll1 = currentScroll1;
    previousScroll2 = currentScroll2;
    previousScroll3 = currentScroll3;
    previousScroll4 = currentScroll4;
    previousScroll5 = currentScroll5;
  });
}
*/

//faq accordians

// $('.faqquestionWrap .faqanswer').slideUp()
// $('.toggler').click(function () {
//   let id = $(this).attr('data-rel')
//   $(this).addClass('active')
//   $(`.faqquestionWrap #${id}`).slideToggle().parent().siblings().find('.faqanswer').slideUp();
// })

// first faq will always active

$(document).ready(function () {
    $(".cardAccordian .cardAccordianBody").not(":first").slideUp();
    $(".cardAccordian .slideUp").not(":first").slideUp();
    $(".cardAccordian:first .accordianToggler").addClass("active");
    $(".content .cardAccordian:first").addClass("active");
    $(".content .cardAccordian:first .slideUp").slideDown();
    $(".accordianToggler").click(function () {
        let id = $(this).attr("data-rel");
        $(this)
            .toggleClass("active")
            .parents(".cardAccordian")
            .siblings()
            .find(".accordianToggler")
            .removeClass("active");
        $(this).parents(".cardAccordian").find(".slideUp").slideToggle();
        $(this).parents(".cardAccordian").siblings().find(".slideUp").slideUp();
        $(this)
            .parents(".cardAccordian")
            .toggleClass("active")
            .siblings()
            .removeClass("active");
        $(`.cardAccordian #${id}`)
            .slideToggle()
            .parent()
            .siblings()
            .find(".cardAccordianBody")
            .slideUp();
    });
});

$(".submenu").click(function () {
    let id = $(this).attr("data-rel");
    $(`#${id}`).addClass("active").siblings().removeClass("active");
    $(this).addClass("active").siblings().removeClass("active");
});

$(document).ready(function () {
    $(".mobAccordian .mobAccordianBody").not(":first").slideUp();
    $(".mobAccordian:first").addClass("active");
    $(".mobAccordian:first .mobAccordianToggeler").addClass("active");
    $(".mobAccordianToggeler").click(function () {
        let id = $(this).attr("data-rel");
        $(this)
            .toggleClass("active")
            .parents(".mobAccordian")
            .siblings()
            .find(".mobAccordianToggeler")
            .removeClass("active");
        $(this)
            .parents(".mobAccordian")
            .siblings()
            .find(".mobAccordianBody")
            .slideUp();
        $(this)
            .parents(".mobAccordian")
            .toggleClass("active")
            .siblings()
            .removeClass("active");
        $(`.mobAccordian #${id}`)
            .slideToggle()
            .parent()
            .siblings()
            .find(".mobAccordianBody")
            .slideUp();
    });
});

$(document).ready(function () {
    $(".faqquestionWrap2 .faqanswer").not(":first").slideUp();
    $(".faqquestionWrap2:first .toggler").addClass("active");
    $(".faqquestionWrap2 .toggler").click(function () {
        let id = $(this).attr("data-rel");
        $(this)
            .toggleClass("active")
            .parents(".faqquestionWrap2")
            .siblings()
            .find(".toggler")
            .removeClass("active");
        $(`.faqquestionWrap2 #${id}`)
            .slideToggle()
            .parent()
            .siblings()
            .find(".faqanswer")
            .slideUp();
    });
});

function openSection(path, location) {
    window.open(path, "_self");
    localStorage.setItem("location", location);
    let section = localStorage.getItem("location");
    $(`#${section}`).addClass("active").siblings().removeClass("active");
    $(`#${section}-menu`).addClass("active").siblings().removeClass("active");
}

//faq accordians

document.addEventListener("DOMContentLoaded", function () {
    let elements = document.getElementsByTagName("lottie-player");

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("play", (event) => {
            // console.log(event.target.shadowRoot.querySelector('svg').style.transform);
            event.target.shadowRoot.querySelector("svg").style.transform = "";
        });
        elements[i].play(); // trigger (again)
    }
});

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("debugNoRedirect") === "true") {
        window.onbeforeunload = function () {
            debugger;
        };
    }
    const section = urlParams.get("section");
    if (section) {
        if (section.startsWith("careertab")) {
            const term = section.split("careertab")[1];
            const outclassView = $(`#term${term}outclass`);
            if (outclassView.length > 0) {
                setTimeout(() => {
                    const parentOffsetTop = outclassView.offset().top;
                    const parentMarginTop = parseInt(outclassView.css("margin-top"));
                    const parentPaddingTop = parseInt(outclassView.css("padding-top"));

                    // Calculate the adjusted offset top
                    const adjustedOffsetTop =
                        parentOffsetTop - parentMarginTop - parentPaddingTop - 100;
                    $("html, body").animate(
                        {
                            scrollTop: adjustedOffsetTop,
                        },
                        800
                    );
                }, 1000);
            }
        }
        const targetElement = $(`[data-rel="${section}"]`);
        if (targetElement.length > 0) {
            targetElement.click();
            $("html, body").animate(
                {
                    scrollTop: targetElement.offset().top,
                },
                800
            );
        }
    }
    urlParams.delete("section");
    const newUrl = urlParams.toString()
        ? `${window.location.pathname}?${urlParams.toString()}`
        : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
});

$(".faqtabs li").click(function (event) {
    let id = $(this).attr("data-rel");
    if (id.includes("inside")) return;
    currentActiveIndex = parseInt($(this).attr("data-index"));
    $(this).addClass("active").siblings().removeClass("active");
    $(`#${id}`).addClass("active").siblings().removeClass("active");

    let scrollContainer = $(this).closest(".tabs");
    let containerLeft = scrollContainer.scrollLeft();
    let containerWidth = scrollContainer.width();
    let tabLeft = $(this).position().left;
    let tabWidth = $(this).outerWidth(true);
    let newScrollLeft =
        containerLeft + tabLeft - containerWidth / 2 + tabWidth / 2;

    scrollContainer.animate({ scrollLeft: newScrollLeft }, 150); // 0.3s smooth scroll

    if (event.target.dataset.swiper === "true") {
        const swiperID = event.target.dataset.rel;
        $(`#swipe-${swiperID}`).siblings().addClass("hide");
        $(`#swipe-${swiperID}`).removeClass("hide");
    }
});


$(document).ready(function () {
    $('a[href^="#"]').on("click", function (event) {
        if ($(this).attr("data-rel") === "external") return;
        event.preventDefault();
        var target = $(this.getAttribute("href"));

        if (target.length) {
            $("html, body").animate(
                {
                    scrollTop: target.offset().top - 76,
                },
                800
            );
        }
    });
});
// old method 
// 90 days in milliseconds
//   const expirationTime = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds//

//   const urlParams = new URLSearchParams(window.location.search);
//   const utmSource = urlParams.get("utm_source");
//   const utmMedium = urlParams.get("utm_medium");
//   const utmCampaign = urlParams.get("utm_campaign");
//   const utmTerm = urlParams.get("utm_term");
//   const utmContent = urlParams.get("utm_content");//

//   // Function to set a cookie with an expiration time
//   function setCookie(name, value, expiration) {
//       const expirationDate = new Date(Date.now() + expiration);
//       document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
//   }//

//   if (utmSource) setCookie("utm_source", utmSource, expirationTime);
//   if (utmMedium) setCookie("utm_medium", utmMedium, expirationTime);
//   if (utmCampaign) setCookie("utm_campaign", utmCampaign, expirationTime);
//   if (utmTerm) setCookie("utm_term", utmTerm, expirationTime);
//   if (utmContent) setCookie("utm_content", utmContent, expirationTime);//

//   function getStoredUtmParam(param) {
//       const cookies = document.cookie.split("; ");
//       for (const cookie of cookies) {
//           const [cookieName, cookieValue] = cookie.split("=");
//           if (cookieName === param) {
//               return cookieValue;
//           }
//       }
//       return "";
//   }//

//   function updateUrlWithUtm() {
//       console.log("yes i am workig uttmmmmmm")
//       const storedUtmSource = getStoredUtmParam("utm_source");
//       const storedUtmMedium = getStoredUtmParam("utm_medium");
//       const storedUtmCampaign = getStoredUtmParam("utm_campaign");
//       const storedUtmTerm = getStoredUtmParam("utm_term");
//       const storedUtmContent = getStoredUtmParam("utm_content");//

//       const currentUrl = window.location.href;//

//       // Build the new URL with UTM parameters
//       const newUrl = new URL(currentUrl);
//       storedUtmSource && newUrl.searchParams.set("utm_source", storedUtmSource);
//       storedUtmMedium && newUrl.searchParams.set("utm_medium", storedUtmMedium);
//       storedUtmCampaign &&
//           newUrl.searchParams.set("utm_campaign", storedUtmCampaign);
//       storedUtmTerm && newUrl.searchParams.set("utm_term", storedUtmTerm);
//       storedUtmContent &&
//           newUrl.searchParams.set("utm_content", storedUtmContent);//

//       // Update the URL without triggering a page reload
//       window.history.pushState({}, "", newUrl.toString());
//   }//

//$(document).ready(function () {
// //

//    updateUrlWithUtm();
//});

// new
// 90 days in milliseconds

var full_utm_url;

const expirationTime = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
const currentUrlOfWebsite = window.location.href;
console.log(currentUrlOfWebsite, 'currentUrlOfWebsite')
// const UTMqueryString = currentUrlOfWebsite.split('?')[1] || ''; // Extract everything after the '?'
// console.log(UTMqueryString, "urllll");
const urlParams = new URLSearchParams(window.location.search);
const utmSource = urlParams.get("utm_source");
const utmMedium = urlParams.get("utm_medium");
const utmCampaign = urlParams.get("utm_campaign");
const utmTerm = urlParams.get("utm_term");
const utmContent = urlParams.get("utm_content");


function removeUTMs(url) {
    const utmArr = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    const [baseUrl, queryString] = url.split("?");
    if (!queryString) return url;

    const queryParams = new URLSearchParams(queryString);

    utmArr.forEach(utmKey => {
        queryParams.delete(utmKey);
    });

    const updatedQueryString = queryParams.toString();
    return updatedQueryString ? `${baseUrl}?${updatedQueryString}` : baseUrl;
}

// Function to set a cookie with an expiration time
function setCookie(name, value, expiration) {
    const expirationDate = new Date(Date.now() + expiration);
    document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
}

if (utmSource) setCookie("utm_source", utmSource, expirationTime);
if (utmMedium) setCookie("utm_medium", utmMedium, expirationTime);
if (utmCampaign) setCookie("utm_campaign", utmCampaign, expirationTime);
if (utmTerm) setCookie("utm_term", utmTerm, expirationTime);
if (utmContent) setCookie("utm_content", utmContent, expirationTime);

const cleanedUrl = removeUTMs(currentUrlOfWebsite);
console.log(cleanedUrl, "cleanedUrl");
const UTMqueryString = cleanedUrl.split('?')[1] || '';
console.log(UTMqueryString, "UTMqueryString")
full_utm_url = UTMqueryString;

if (UTMqueryString) setCookie("full_utm_url", UTMqueryString, expirationTime);



function getStoredUtmParam(param) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === param) {
            return cookieValue;
        }
    }
    return "";
}
function getCookieValue(name) {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
}
function updateUrlWithUtm() {
    console.log("yes i am workig uttmmmmmm")
    const storedUtmSource = getStoredUtmParam("utm_source");
    const storedUtmMedium = getStoredUtmParam("utm_medium");
    const storedUtmCampaign = getStoredUtmParam("utm_campaign");
    const storedUtmTerm = getStoredUtmParam("utm_term");
    const storedUtmContent = getStoredUtmParam("utm_content");
    const storedFullUTMUrl = getCookieValue("full_utm_url");

    const currentUrl = window.location.href;
    console.log("currentUrl ", currentUrl);
    //  newUrl.search = storedFullUTMUrl; // Replace the entire search query with utmUrlGroup

    // Build the new URL with UTM parameters
    const newUrl = new URL(currentUrl);
    console.log("newUrl ", newUrl);
    console.log("newUrl.search beefore", newUrl.search);
    //  if (storedFullUTMUrl) {
    //      newUrl.urlSearchParams.set(storedFullUTMUrl) ; // Replace the entire search query with utmUrlGroup
    //  }

    // Create a new URLSearchParams object to store final merged query parameters
    const updatedParams = new URLSearchParams(currentUrl.search);

    console.log("updatedParams: " + updatedParams);

    // Append or update UTM parameters
    if (storedUtmSource) updatedParams.set("utm_source", storedUtmSource);
    if (storedUtmMedium) updatedParams.set("utm_medium", storedUtmMedium);
    if (storedUtmCampaign) updatedParams.set("utm_campaign", storedUtmCampaign);
    if (storedUtmTerm) updatedParams.set("utm_term", storedUtmTerm);
    if (storedUtmContent) updatedParams.set("utm_content", storedUtmContent);

    console.log("updatedParams after: " + updatedParams);

    // Merge additional query parameters from storedFullUTMUrl
    if (storedFullUTMUrl && storedFullUTMUrl.trim() !== '') {
        const additionalParams = new URLSearchParams(storedFullUTMUrl);
        console.log("additionalParams: " + additionalParams);
        additionalParams.forEach((value, key) => {
            updatedParams.set(key, value);
        });
    }
    console.log("updatedParams after after: " + updatedParams);
    console.log("updatedParams.toString(): " + updatedParams.toString());

    // Update the URL search with the combined parameters
    newUrl.search = updatedParams.toString();
    console.log("Updated URL:", currentUrl);

    // Update the browser URL without reloading the page
    window.history.pushState({}, "", newUrl.toString());
}
$(document).ready(function () {

    console.log(full_utm_url, "qqqqureell11");

    // If current page is not /events call the function
    if (window.location.pathname !== "/events") {
        updateUrlWithUtm();
    }

});


async function pushToNPF(lead) {
    const { name, email, mobile, course = "", ...otherFields } = lead;
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const utmSource = params.utm_source || "Website";
    const utmMedium = params.utm_medium;
    const utmCampaign = params.utm_campaign;
    const utmTerm = params.utm_term;
    const utmContent = params.utm_content;
    const device = window.matchMedia("(max-width: 768px)").matches
        ? "Mobile"
        : "Desktop";
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://api.mastersunion.org/api/leads/pushToNPF",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                field_device_type: device,
                email,
                name,
                mobile,
                linkedinProfile: "",
                medium: utmMedium,
                campaign: utmCampaign,
                source: utmSource,
                course: course,
                utmTerm: utmTerm,
                utmContent: utmContent,
                sendMail: false,
                field_utm_url: window.location.href,
                ...otherFields,
            }),
            dataType: "json",
            success: (data) => resolve(data),
            error: (xhr, status, error) => reject({ status, error }),
        });
    });
}

async function pushToNPF_PGP_TBM(lead) {
    const { name, email, mobile, course = "", ...otherFields } = lead;
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const utmSource = params.utm_source || "Website";
    const utmMedium = params.utm_medium;
    const utmCampaign = params.utm_campaign;
    const utmTerm = params.utm_term;
    const utmContent = params.utm_content;
    const device = window.matchMedia("(max-width: 768px)").matches
        ? "Mobile"
        : "Desktop";
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://api.mastersunion.org/api/leads/pushToNPF_PGP_TBM",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                field_device_type: device,
                email,
                name,
                mobile,
                linkedinProfile: "",
                medium: utmMedium,
                campaign: utmCampaign,
                source: utmSource,
                course: "Course",
                utmTerm: utmTerm,
                utmContent: utmContent,
                sendMail: false,
                field_utm_url: window.location.href,
                ...otherFields,
            }),
            dataType: "json",
            success: (data) => resolve(data),
            error: (xhr, status, error) => reject({ status, error }),
        });
    });
}

async function pushToNPF_UG(lead) {
    const { name, email, mobile, course = "", medium = "", ...otherFields } = lead;
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const utmSource = params.utm_source || "Website";
    const utmMedium = params.utm_medium || medium;
    const utmCampaign = params.utm_campaign;
    const utmTerm = params.utm_term;
    const utmContent = params.utm_content;
    const device = window.matchMedia("(max-width: 768px)").matches
        ? "Mobile"
        : "Desktop";
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://api.mastersunion.org/api/leads/pushToNPF_UG",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                field_device_type: device,
                email,
                name,
                mobile,
                linkedinProfile: "",
                medium: utmMedium,
                campaign: utmCampaign,
                source: utmSource,
                // course: course,
                utmTerm: utmTerm,
                utmContent: utmContent,
                sendMail: false,
                field_utm_url: window.location.href,
                ...otherFields,
            }),
            dataType: "json",
            success: (data) => resolve(data),
            error: (xhr, status, error) => reject({ status, error }),
        });
    });
}

async function pushToNPF_MENACheck(lead) {
    const { name, email, mobile, course = "", ...otherFields } = lead;
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const utmSource = params.utm_source || "Website";
    const utmMedium = params.utm_medium;
    const utmCampaign = params.utm_campaign;
    const utmTerm = params.utm_term;
    const utmContent = params.utm_content;
    const device = window.matchMedia("(max-width: 768px)").matches
        ? "Mobile"
        : "Desktop";
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://api.mastersunion.org/api/leads/${APIpushToNPFendPoint}`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                field_device_type: device,
                email,
                name,
                mobile,
                linkedinProfile: "",
                medium: utmMedium,
                campaign: utmCampaign,
                source: utmSource,
                course: course,
                utmTerm: utmTerm,
                utmContent: utmContent,
                sendMail: false,
                field_utm_url: window.location.href,
                ...otherFields
            }),
            dataType: "json",
            success: (data) => resolve(data),
            error: (xhr, status, error) => reject({ status, error }),
        });
    });
}
// Map country codes to currency codes
let APIpushToNPFendPoint = "pushToNPF";
let isCountryCodeFound = false;
$(document).ready(async function () {
    let countryCodeForMobile;

    const countryCurrencyMap = {
        IN: "INR",
        US: "USD",
        GB: "GBP",
        EU: "EUR",
        CA: "CAD",
        AU: "AUD",
        JP: "JPY",
        CN: "CNY",
        KR: "KRW",
        BR: "BRL",
        ZA: "ZAR",
        MX: "MXN",
        RU: "RUB",
        NZ: "NZD",
        SG: "SGD",
        HK: "HKD",
        SE: "SEK",
        NO: "NOK",
        DK: "DKK",
        CH: "CHF",
        IL: "ILS",
        TR: "TRY",
        AR: "ARS",
        CL: "CLP",
        CO: "COP",
        PE: "PEN",
        PH: "PHP",
        TH: "THB",
        MY: "MYR",
        ID: "IDR",
        PL: "PLN",
        CZ: "CZK",
        HU: "HUF",
        SK: "EUR",
        AT: "EUR",
        IE: "EUR",
        LU: "EUR",
        MT: "EUR",
        FI: "EUR",
        PT: "EUR",
        GR: "EUR",
        NL: "EUR",
        BE: "EUR",
        EE: "EUR",
        LV: "EUR",
        LT: "EUR",
        CY: "EUR",
        SI: "EUR",
        BG: "BGN",
        RO: "RON",
        IS: "ISK",
        HR: "HRK",
        AE: "AED",
        SA: "SAR",
        EG: "EGP",
        PK: "PKR",
        BD: "BDT",
        NG: "NGN",
        KE: "KES",
        GH: "GHS",
        VN: "VND",
        IQ: "IQD",
        IR: "IRR",
        KW: "KWD",
        OM: "OMR",
        QA: "QAR",
        BH: "BHD",
        LB: "LBP",
        JO: "JOD",
        DZ: "DZD",
        TN: "TND",
        MA: "MAD",
        MU: "MUR",
        LK: "LKR",
        NP: "NPR",
        MM: "MMK",
        UA: "UAH",
        KZ: "KZT",
        GE: "GEL",
        UZ: "UZS",
        KG: "KGS",
        MD: "MDL",
        AZ: "AZN",
        AM: "AMD",
        BY: "BYN",
        RS: "RSD",
        MK: "MKD",
        ME: "EUR",
        LY: "LYD",
        YE: "YER",
        SY: "SYP",
    };

    const countryCurrencyMapMENA_region = {
        US: "USD", // United States
        DZ: "DZD", // Algeria
        BH: "BHD", // Bahrain
        EG: "EGP", // Egypt
        IQ: "IQD", // Iraq
        JO: "JOD", // Jordan
        KW: "KWD", // Kuwait
        LY: "LYD", // Libya
        OM: "OMR", // Oman
        QA: "QAR", // Qatar
        SA: "SAR", // Saudi Arabia
        AE: "AED", // United Arab Emirates
        YE: "YER", // Yemen
        IL: "ILS", // Israel
        MA: "MAD", // Morocco
        TN: "TND", // Tunisia
        LB: "LBP", // Lebanon
        SY: "SYP", // Syria
        IR: "IRR", // Iran
    };

    async function getUserCountry() {
        try {
            const geoApiUrl = 'https://api.country.is/';
            const response = await fetch(geoApiUrl);
            const data = await response.json();
            return data.country;
        } catch (error) {
            console.error('Error fetching user country:', error);
            return 'US'; // Fallback to US in case of failure
        }
    }
    const timeZoneMapping = {
        "America/Aruba": "AW",
        "Asia/Kabul": "AF",
        "Africa/Luanda": "AO",
        "America/Anguilla": "AI",
        "Europe/Mariehamn": "AX",
        "Europe/Tirane": "AL",
        "Europe/Andorra": "AD",
        "Asia/Dubai": "AE",
        "America/Argentina/Buenos_Aires": "AR",
        "America/Argentina/Cordoba": "AR",
        "America/Argentina/Salta": "AR",
        "America/Argentina/Jujuy": "AR",
        "America/Argentina/Tucuman": "AR",
        "America/Argentina/Catamarca": "AR",
        "America/Argentina/La_Rioja": "AR",
        "America/Argentina/San_Juan": "AR",
        "America/Argentina/Mendoza": "AR",
        "America/Argentina/San_Luis": "AR",
        "America/Argentina/Rio_Gallegos": "AR",
        "America/Argentina/Ushuaia": "AR",
        "Asia/Yerevan": "AM",
        "Pacific/Pago_Pago": "AS",
        "Antarctica/McMurdo": "AQ",
        "Antarctica/Casey": "AQ",
        "Antarctica/Davis": "AQ",
        "Antarctica/DumontDUrville": "AQ",
        "Antarctica/Mawson": "AQ",
        "Antarctica/Palmer": "AQ",
        "Antarctica/Rothera": "AQ",
        "Antarctica/Syowa": "AQ",
        "Antarctica/Troll": "AQ",
        "Antarctica/Vostok": "AQ",
        "Indian/Kerguelen": "TF",
        "America/Antigua": "AG",
        "Australia/Lord_Howe": "AU",
        "Antarctica/Macquarie": "AU",
        "Australia/Hobart": "AU",
        "Australia/Currie": "AU",
        "Australia/Melbourne": "AU",
        "Australia/Sydney": "AU",
        "Australia/Broken_Hill": "AU",
        "Australia/Brisbane": "AU",
        "Australia/Lindeman": "AU",
        "Australia/Adelaide": "AU",
        "Australia/Darwin": "AU",
        "Australia/Perth": "AU",
        "Australia/Eucla": "AU",
        "Europe/Vienna": "AT",
        "Asia/Baku": "AZ",
        "Africa/Bujumbura": "BI",
        "Europe/Brussels": "BE",
        "Africa/Porto-Novo": "BJ",
        "Africa/Ouagadougou": "BF",
        "Asia/Dhaka": "BD",
        "Europe/Sofia": "BG",
        "Asia/Bahrain": "BH",
        "America/Nassau": "BS",
        "Europe/Sarajevo": "BA",
        "America/St_Barthelemy": "BL",
        "Europe/Minsk": "BY",
        "America/Belize": "BZ",
        "Atlantic/Bermuda": "BM",
        "America/La_Paz": "BO",
        "America/Noronha": "BR",
        "America/Belem": "BR",
        "America/Fortaleza": "BR",
        "America/Recife": "BR",
        "America/Araguaina": "BR",
        "America/Maceio": "BR",
        "America/Bahia": "BR",
        "America/Sao_Paulo": "BR",
        "America/Campo_Grande": "BR",
        "America/Cuiaba": "BR",
        "America/Santarem": "BR",
        "America/Porto_Velho": "BR",
        "America/Boa_Vista": "BR",
        "America/Manaus": "BR",
        "America/Eirunepe": "BR",
        "America/Rio_Branco": "BR",
        "America/Barbados": "BB",
        "Asia/Brunei": "BN",
        "Asia/Thimphu": "BT",
        "Europe/Oslo": "NO",
        "Africa/Gaborone": "BW",
        "Africa/Bangui": "CF",
        "America/St_Johns": "CA",
        "America/Halifax": "CA",
        "America/Glace_Bay": "CA",
        "America/Moncton": "CA",
        "America/Goose_Bay": "CA",
        "America/Blanc-Sablon": "CA",
        "America/Toronto": "CA",
        "America/Nipigon": "CA",
        "America/Thunder_Bay": "CA",
        "America/Iqaluit": "CA",
        "America/Pangnirtung": "CA",
        "America/Atikokan": "CA",
        "America/Winnipeg": "CA",
        "America/Rainy_River": "CA",
        "America/Resolute": "CA",
        "America/Rankin_Inlet": "CA",
        "America/Regina": "CA",
        "America/Swift_Current": "CA",
        "America/Edmonton": "CA",
        "America/Cambridge_Bay": "CA",
        "America/Yellowknife": "CA",
        "America/Inuvik": "CA",
        "America/Creston": "CA",
        "America/Dawson_Creek": "CA",
        "America/Fort_Nelson": "CA",
        "America/Vancouver": "CA",
        "America/Whitehorse": "CA",
        "America/Dawson": "CA",
        "Indian/Cocos": "CC",
        "Europe/Zurich": "CH",
        "America/Santiago": "CL",
        "Pacific/Easter": "CL",
        "Asia/Shanghai": "CN",
        "Asia/Urumqi": "CN",
        "Africa/Abidjan": "CI",
        "Africa/Douala": "CM",
        "Africa/Kinshasa": "CD",
        "Africa/Lubumbashi": "CD",
        "Africa/Brazzaville": "CG",
        "Pacific/Rarotonga": "CK",
        "America/Bogota": "CO",
        "Indian/Comoro": "KM",
        "Atlantic/Cape_Verde": "CV",
        "America/Costa_Rica": "CR",
        "America/Havana": "CU",
        "America/Curacao": "CW",
        "Indian/Christmas": "CX",
        "America/Cayman": "KY",
        "Asia/Nicosia": "CY",
        "Europe/Prague": "CZ",
        "Europe/Berlin": "DE",
        "Europe/Busingen": "DE",
        "Africa/Djibouti": "DJ",
        "America/Dominica": "DM",
        "Europe/Copenhagen": "DK",
        "America/Santo_Domingo": "DO",
        "Africa/Algiers": "DZ",
        "America/Guayaquil": "EC",
        "Pacific/Galapagos": "EC",
        "Africa/Cairo": "EG",
        "Africa/Asmara": "ER",
        "Africa/El_Aaiun": "EH",
        "Europe/Madrid": "ES",
        "Africa/Ceuta": "ES",
        "Atlantic/Canary": "ES",
        "Europe/Tallinn": "EE",
        "Africa/Addis_Ababa": "ET",
        "Europe/Helsinki": "FI",
        "Pacific/Fiji": "FJ",
        "Atlantic/Stanley": "FK",
        "Europe/Paris": "FR",
        "Atlantic/Faroe": "FO",
        "Pacific/Chuuk": "FM",
        "Pacific/Pohnpei": "FM",
        "Pacific/Kosrae": "FM",
        "Africa/Libreville": "GA",
        "Europe/London": "GB",
        "Asia/Tbilisi": "GE",
        "Europe/Guernsey": "GG",
        "Africa/Accra": "GH",
        "Europe/Gibraltar": "GI",
        "Africa/Conakry": "GN",
        "America/Guadeloupe": "GP",
        "Africa/Banjul": "GM",
        "Africa/Bissau": "GW",
        "Africa/Malabo": "GQ",
        "Europe/Athens": "GR",
        "America/Grenada": "GD",
        "America/Godthab": "GL",
        "America/Danmarkshavn": "GL",
        "America/Scoresbysund": "GL",
        "America/Thule": "GL",
        "America/Guatemala": "GT",
        "America/Cayenne": "GF",
        "Pacific/Guam": "GU",
        "America/Guyana": "GY",
        "Asia/Hong_Kong": "HK",
        "America/Tegucigalpa": "HN",
        "Europe/Zagreb": "HR",
        "America/Port-au-Prince": "HT",
        "Europe/Budapest": "HU",
        "Asia/Jakarta": "ID",
        "Asia/Pontianak": "ID",
        "Asia/Makassar": "ID",
        "Asia/Jayapura": "ID",
        "Europe/Isle_of_Man": "IM",
        "Asia/Kolkata": "IN",
        "Indian/Chagos": "IO",
        "Europe/Dublin": "IE",
        "Asia/Tehran": "IR",
        "Asia/Baghdad": "IQ",
        "Atlantic/Reykjavik": "IS",
        "Asia/Jerusalem": "IL",
        "Europe/Rome": "IT",
        "America/Jamaica": "JM",
        "Europe/Jersey": "JE",
        "Asia/Amman": "JO",
        "Asia/Tokyo": "JP",
        "Asia/Almaty": "KZ",
        "Asia/Qyzylorda": "KZ",
        "Asia/Aqtobe": "KZ",
        "Asia/Aqtau": "KZ",
        "Asia/Oral": "KZ",
        "Africa/Nairobi": "KE",
        "Asia/Bishkek": "KG",
        "Asia/Phnom_Penh": "KH",
        "Pacific/Tarawa": "KI",
        "Pacific/Enderbury": "KI",
        "Pacific/Kiritimati": "KI",
        "America/St_Kitts": "KN",
        "Asia/Seoul": "KR",
        "Europe/Belgrade": "RS",
        "Asia/Kuwait": "KW",
        "Asia/Vientiane": "LA",
        "Asia/Beirut": "LB",
        "Africa/Monrovia": "LR",
        "Africa/Tripoli": "LY",
        "America/St_Lucia": "LC",
        "Europe/Vaduz": "LI",
        "Asia/Colombo": "LK",
        "Africa/Maseru": "LS",
        "Europe/Vilnius": "LT",
        "Europe/Luxembourg": "LU",
        "Europe/Riga": "LV",
        "Asia/Macau": "MO",
        "America/Marigot": "MF",
        "Africa/Casablanca": "MA",
        "Europe/Monaco": "MC",
        "Europe/Chisinau": "MD",
        "Indian/Antananarivo": "MG",
        "Indian/Maldives": "MV",
        "America/Mexico_City": "MX",
        "America/Cancun": "MX",
        "America/Merida": "MX",
        "America/Monterrey": "MX",
        "America/Matamoros": "MX",
        "America/Mazatlan": "MX",
        "America/Chihuahua": "MX",
        "America/Ojinaga": "MX",
        "America/Hermosillo": "MX",
        "America/Tijuana": "MX",
        "America/Bahia_Banderas": "MX",
        "Pacific/Majuro": "MH",
        "Pacific/Kwajalein": "MH",
        "Europe/Skopje": "MK",
        "Africa/Bamako": "ML",
        "Europe/Malta": "MT",
        "Asia/Rangoon": "MM",
        "Europe/Podgorica": "ME",
        "Asia/Ulaanbaatar": "MN",
        "Asia/Hovd": "MN",
        "Asia/Choibalsan": "MN",
        "Pacific/Saipan": "MP",
        "Africa/Maputo": "MZ",
        "Africa/Nouakchott": "MR",
        "America/Montserrat": "MS",
        "America/Martinique": "MQ",
        "Indian/Mauritius": "MU",
        "Africa/Blantyre": "MW",
        "Asia/Kuala_Lumpur": "MY",
        "Asia/Kuching": "MY",
        "Indian/Mayotte": "YT",
        "Africa/Windhoek": "NA",
        "Pacific/Noumea": "NC",
        "Africa/Niamey": "NE",
        "Pacific/Norfolk": "NF",
        "Africa/Lagos": "NG",
        "America/Managua": "NI",
        "Pacific/Niue": "NU",
        "Europe/Amsterdam": "NL",
        "Asia/Kathmandu": "NP",
        "Pacific/Nauru": "NR",
        "Pacific/Auckland": "NZ",
        "Pacific/Chatham": "NZ",
        "Asia/Muscat": "OM",
        "Asia/Karachi": "PK",
        "America/Panama": "PA",
        "Pacific/Pitcairn": "PN",
        "America/Lima": "PE",
        "Asia/Manila": "PH",
        "Pacific/Palau": "PW",
        "Pacific/Port_Moresby": "PG",
        "Pacific/Bougainville": "PG",
        "Europe/Warsaw": "PL",
        "America/Puerto_Rico": "PR",
        "Asia/Pyongyang": "KP",
        "Europe/Lisbon": "PT",
        "Atlantic/Madeira": "PT",
        "Atlantic/Azores": "PT",
        "America/Asuncion": "PY",
        "Asia/Gaza": "PS",
        "Asia/Hebron": "PS",
        "Pacific/Tahiti": "PF",
        "Pacific/Marquesas": "PF",
        "Pacific/Gambier": "PF",
        "Asia/Qatar": "QA",
        "Indian/Reunion": "RE",
        "Europe/Bucharest": "RO",
        "Europe/Kaliningrad": "RU",
        "Europe/Moscow": "RU",
        "Europe/Simferopol": "RU",
        "Europe/Volgograd": "RU",
        "Europe/Kirov": "RU",
        "Europe/Astrakhan": "RU",
        "Europe/Samara": "RU",
        "Europe/Ulyanovsk": "RU",
        "Asia/Yekaterinburg": "RU",
        "Asia/Omsk": "RU",
        "Asia/Novosibirsk": "RU",
        "Asia/Barnaul": "RU",
        "Asia/Tomsk": "RU",
        "Asia/Novokuznetsk": "RU",
        "Asia/Krasnoyarsk": "RU",
        "Asia/Irkutsk": "RU",
        "Asia/Chita": "RU",
        "Asia/Yakutsk": "RU",
        "Asia/Khandyga": "RU",
        "Asia/Vladivostok": "RU",
        "Asia/Ust-Nera": "RU",
        "Asia/Magadan": "RU",
        "Asia/Sakhalin": "RU",
        "Asia/Srednekolymsk": "RU",
        "Asia/Kamchatka": "RU",
        "Asia/Anadyr": "RU",
        "Africa/Kigali": "RW",
        "Asia/Riyadh": "SA",
        "Africa/Khartoum": "SD",
        "Africa/Dakar": "SN",
        "Asia/Singapore": "SG",
        "Atlantic/South_Georgia": "GS",
        "Arctic/Longyearbyen": "SJ",
        "Pacific/Guadalcanal": "SB",
        "Africa/Freetown": "SL",
        "America/El_Salvador": "SV",
        "Europe/San_Marino": "SM",
        "Africa/Mogadishu": "SO",
        "America/Miquelon": "PM",
        "Africa/Juba": "SS",
        "Africa/Sao_Tome": "ST",
        "America/Paramaribo": "SR",
        "Europe/Bratislava": "SK",
        "Europe/Ljubljana": "SI",
        "Europe/Stockholm": "SE",
        "Africa/Mbabane": "SZ",
        "America/Lower_Princes": "SX",
        "Indian/Mahe": "SC",
        "Asia/Damascus": "SY",
        "America/Grand_Turk": "TC",
        "Africa/Ndjamena": "TD",
        "Africa/Lome": "TG",
        "Asia/Bangkok": "TH",
        "Asia/Dushanbe": "TJ",
        "Pacific/Fakaofo": "TK",
        "Asia/Ashgabat": "TM",
        "Asia/Dili": "TL",
        "Pacific/Tongatapu": "TO",
        "America/Port_of_Spain": "TT",
        "Africa/Tunis": "TN",
        "Europe/Istanbul": "TR",
        "Pacific/Funafuti": "TV",
        "Asia/Taipei": "TW",
        "Africa/Dar_es_Salaam": "TZ",
        "Africa/Kampala": "UG",
        "Europe/Kiev": "UA",
        "Europe/Uzhgorod": "UA",
        "Europe/Zaporozhye": "UA",
        "Pacific/Johnston": "UM",
        "Pacific/Midway": "UM",
        "Pacific/Wake": "UM",
        "America/Montevideo": "UY",
        "America/New_York": "US",
        "America/Detroit": "US",
        "America/Kentucky/Louisville": "US",
        "America/Kentucky/Monticello": "US",
        "America/Indiana/Indianapolis": "US",
        "America/Indiana/Vincennes": "US",
        "America/Indiana/Winamac": "US",
        "America/Indiana/Marengo": "US",
        "America/Indiana/Petersburg": "US",
        "America/Indiana/Vevay": "US",
        "America/Chicago": "US",
        "America/Indiana/Tell_City": "US",
        "America/Indiana/Knox": "US",
        "America/Menominee": "US",
        "America/North_Dakota/Center": "US",
        "America/North_Dakota/New_Salem": "US",
        "America/North_Dakota/Beulah": "US",
        "America/Denver": "US",
        "America/Boise": "US",
        "America/Phoenix": "US",
        "America/Los_Angeles": "US",
        "America/Anchorage": "US",
        "America/Juneau": "US",
        "America/Sitka": "US",
        "America/Metlakatla": "US",
        "America/Yakutat": "US",
        "America/Nome": "US",
        "America/Adak": "US",
        "Pacific/Honolulu": "US",
        "Asia/Samarkand": "UZ",
        "Asia/Tashkent": "UZ",
        "Europe/Vatican": "VA",
        "America/St_Vincent": "VC",
        "America/Caracas": "VE",
        "America/Tortola": "VG",
        "America/St_Thomas": "VI",
        "Asia/Ho_Chi_Minh": "VN",
        "Pacific/Efate": "VU",
        "Pacific/Wallis": "WF",
        "Pacific/Apia": "WS",
        "Asia/Aden": "YE",
        "Africa/Johannesburg": "ZA",
        "Africa/Lusaka": "ZM",
        "Africa/Harare": "ZW",
        "Asia/Calcutta": "IN"
    };

    //  async function getUserCountry() {
    //    try {
    //      let userTimeZone;
    //      let countryCode;
    //      if (Intl) {
    //        userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //        console.log("time zone: " + userTimeZone);//

    //        countryCode = timeZoneMapping[userTimeZone];//

    //        console.log("countryCode:", countryCode);
    //      }//

    //      return countryCode ? countryCode : "US";
    //    } catch (error) {
    //      console.error("Error fetching user country:", error);
    //      return "US"; // Fallback to US in case of failure
    //    }
    //  }

    // Function to get the exchange rate from a conversion API
    async function getExchangeRate(baseCurrency, targetCurrency) {
        try {
            const conversionApiUrl = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;
            const response = await fetch(conversionApiUrl);
            const data = await response.json();
            return data.rates[targetCurrency];
        } catch (error) {
            console.error("Error fetching exchange rate:", error);
            return 1; // Fallback rate in case of failure
        }
    }

    // Function to convert currency based on the rate
    function convertCurrency(amount, rate) {
        return (amount * rate).toFixed(0);
    }

    // Function to format currency using Intl.NumberFormat
    function formatCurrency(amount, currencyCode, locale) {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currencyCode,
        }).format(amount);
    }

    // Function to update currency display on the page
    async function updateCurrency() {
        try {
            console.log("first call curereny conveersionss");
            const userCountryCode = await getUserCountry();
            const isIndianUser = userCountryCode === "IN";
            countryCodeForMobile = userCountryCode;
            const feeData = {
                US: {
                    ApplicationRound1FeePgpRiseMENA: 59,
                    admissionFeePgpRiseMENA: 1185,
                    tuitionFeePgpRiseMENA: 48585,
                    membershipFeePgpRiseMENA: 3555,
                    totalFeePgpRiseMENA: 53325,
                },
                // BH: {
                //   ApplicationRound1FeePgpRiseMENA: 22,
                //   admissionFeePgpRiseMENA: 444,
                //   tuitionFeePgpRiseMENA: 18204,
                //   membershipFeePgpRiseMENA: 1332,
                //   totalFeePgpRiseMENA: 20002,
                // },
                // KW: {
                //   ApplicationRound1FeePgpRiseMENA: 18,
                //   admissionFeePgpRiseMENA: 363,
                //   tuitionFeePgpRiseMENA: 14883,
                //   membershipFeePgpRiseMENA: 1089,
                //   totalFeePgpRiseMENA: 16353,
                // },
                // OM: {
                //   ApplicationRound1FeePgpRiseMENA: 23,
                //   admissionFeePgpRiseMENA: 455,
                //   tuitionFeePgpRiseMENA: 18655,
                //   membershipFeePgpRiseMENA: 1365,
                //   totalFeePgpRiseMENA: 20498,
                // },
                // QA: {
                //   ApplicationRound1FeePgpRiseMENA: 211,
                //   admissionFeePgpRiseMENA: 4222,
                //   tuitionFeePgpRiseMENA: 173102,
                //   membershipFeePgpRiseMENA: 12666,
                //   totalFeePgpRiseMENA: 190201,
                // },
                // SA: {
                //   ApplicationRound1FeePgpRiseMENA: 222,
                //   admissionFeePgpRiseMENA: 4444,
                //   tuitionFeePgpRiseMENA: 182204,
                //   membershipFeePgpRiseMENA: 13332,
                //   totalFeePgpRiseMENA: 200202,
                // },
                AE: {
                    ApplicationRound1FeePgpRiseMENA: 218,
                    admissionFeePgpRiseMENA: 4351,
                    tuitionFeePgpRiseMENA: 178391,
                    membershipFeePgpRiseMENA: 13053,
                    totalFeePgpRiseMENA: 196013,
                },
            };

            const fallbackFees = {
                ApplicationRound1FeePgpRiseMENA: 59,
                admissionFeePgpRiseMENA: 1185,
                tuitionFeePgpRiseMENA: 48585,
                membershipFeePgpRiseMENA: 3555,
                totalFeePgpRiseMENA: 53325,
            };

            // Amounts for India and Outside India
            const indiaAmounts = {
                admissionFee: 82600,
                tuitionFee: 2112200,
                membershipFee: 129800,
                totalFee: 2324600,
                round1Fee: 2000,
                round2Fee: 2000,
            };

            const outsideIndiaAmounts = {
                admissionFee: 300000,
                tuitionFee: 3900000,
                membershipFee: 300000,
                totalFee: 4515000,
                round1Fee: 15000,
                round2Fee: 15000,
            };
            //  for mena 18 region countries PGP Rise: General Management (Global)
            const outsideIndiaAmountsMENAPGP_Rise = {
                admissionFeePgpRiseMENA: 300000,
                tuitionFeePgpRiseMENA: 3900000,
                membershipFeePgpRiseMENA: 300000,
                totalFeePgpRiseMENA: 4515000,
                ApplicationRound1FeePgpRiseMENA: 15000,
                ApplicationRound2FeePgpRiseMENA: 15000,
            };
            // Hide or update content based on country
            const UserFees = feeData[userCountryCode] || fallbackFees;

            console.log("Fees for user:", UserFees);
            if (isIndianUser) {
                console.log("india rtoh hai :::");
                const userCurrency =
                    countryCurrencyMapMENA_region[userCountryCode] || "USD"; // Default to USD if not found
                console.log(userCurrency, "usercurrency:::::");
                // Get exchange rate to convert from INR to the user's currency
                const exchangeRate = await getExchangeRate("INR", userCurrency);
                $("#round1FeePgpRiseMENA").text(
                    formatCurrency(
                        UserFees.ApplicationRound1FeePgpRiseMENA,
                        userCurrency,
                        "en-US"
                    )
                );
                $("#round2FeePgpRiseMENA").text(
                    formatCurrency(
                        UserFees.ApplicationRound1FeePgpRiseMENA,
                        userCurrency,
                        "en-US"
                    )
                );
                $("#admissionFeePgpRiseMENA").text(
                    formatCurrency(
                        UserFees.admissionFeePgpRiseMENA,
                        userCurrency,
                        "en-US"
                    )
                );
                $("#tuitionFeePgpRiseMENA").text(
                    formatCurrency(UserFees.tuitionFeePgpRiseMENA, userCurrency, "en-US")
                );
                $("#membershipFeePgpRiseMENA").text(
                    formatCurrency(
                        UserFees.membershipFeePgpRiseMENA,
                        userCurrency,
                        "en-US"
                    )
                );
                $("#totalFeePgpRiseMENA").text(
                    formatCurrency(UserFees.totalFeePgpRiseMENA, userCurrency, "en-US")
                );

                return;
                //$('#round1Fee').text(formatCurrency(indiaAmounts.round1Fee, 'INR', 'en-IN'));
                //$('#round2Fee').text(formatCurrency(indiaAmounts.round2Fee, 'INR', 'en-IN'));
                //$('#admissionFee').text(formatCurrency(indiaAmounts.admissionFee, 'INR', 'en-IN'));
                //$('#tuitionFee').text(formatCurrency(indiaAmounts.tuitionFee, 'INR', 'en-IN'));
                //$('#membershipFee').text(formatCurrency(indiaAmounts.membershipFee, 'INR', 'en-IN'));
                //$('#totalFee').text(formatCurrency(indiaAmounts.totalFee, 'INR', 'en-IN'));
            }

            // Get the user's currency or default to USD if the country is not in the map
            const userCurrency =
                countryCurrencyMapMENA_region[userCountryCode] || "USD"; // Default to USD if not found
            console.log(userCurrency, "usercurrency:::::");
            // Get exchange rate to convert from INR to the user's currency
            const exchangeRate = await getExchangeRate("INR", userCurrency);

            // Convert and update the amounts for users outside India
            // $('#round1Fee').text(formatCurrency(convertCurrency(outsideIndiaAmounts.round1Fee, exchangeRate), userCurrency, 'en-US'));
            // $('#round2Fee').text(formatCurrency(convertCurrency(outsideIndiaAmounts.round2Fee, exchangeRate), userCurrency, 'en-US'));
            // $('#admissionFee').text(formatCurrency(convertCurrency(outsideIndiaAmounts.admissionFee, exchangeRate), userCurrency, 'en-US'));
            // $('#tuitionFee').text(formatCurrency(convertCurrency(outsideIndiaAmounts.tuitionFee, exchangeRate), userCurrency, 'en-US'));
            // $('#membershipFee').text(formatCurrency(convertCurrency(outsideIndiaAmounts.membershipFee, exchangeRate), userCurrency, 'en-US'));
            // $('#totalFee').text(formatCurrency(convertCurrency(outsideIndiaAmounts.totalFee, exchangeRate), userCurrency, 'en-US'));

            //  logic for changing for mena 18 region countries PGP Rise: General Management (Global)
            $("#round1FeePgpRiseMENA").text(
                formatCurrency(
                    UserFees.ApplicationRound1FeePgpRiseMENA,
                    userCurrency,
                    "en-US"
                )
            );
            $("#round2FeePgpRiseMENA").text(
                formatCurrency(
                    UserFees.ApplicationRound1FeePgpRiseMENA,
                    userCurrency,
                    "en-US"
                )
            );
            $("#admissionFeePgpRiseMENA").text(
                formatCurrency(UserFees.admissionFeePgpRiseMENA, userCurrency, "en-US")
            );
            $("#tuitionFeePgpRiseMENA").text(
                formatCurrency(UserFees.tuitionFeePgpRiseMENA, userCurrency, "en-US")
            );
            $("#membershipFeePgpRiseMENA").text(
                formatCurrency(UserFees.membershipFeePgpRiseMENA, userCurrency, "en-US")
            );
            $("#totalFeePgpRiseMENA").text(
                formatCurrency(UserFees.totalFeePgpRiseMENA, userCurrency, "en-US")
            );

            // --------- Conditions for outside of the country india ----------------
            console.log("i changed the mena123:");
            APIpushToNPFendPoint = "pushToNPF_MENA";
            $(".changeAccOutsideIndia").text("January 2025");
            //  $('.changefaq_tab-d-3Mena').text("Their studies will continue on the weekend they can join in virtually.");
            //  $('.changefaq_tab-d-5Mena').text("Our deadlines are non-negotiable. Applications must be completed and submitted by midnight to be included in the ongoing round. A complete application includes the online form, all supporting documents, references, essays, and payment of the application fees.");
            $(".hideFortheMENA").addClass("hide");
            $("#MENAimgChange").attr(
                "src",
                "https://cdn.mastersunion.link/assets/imgV2/InseadNew.png"
            );

            isCountryCodeFound = true;
        } catch (err) {
            console.error("Error in currency update:", err);
        }
    }

    async function getAllCountries() {
        try {
            console.log("2nd call get countries and set optionss");

            const response = await $.ajax({
                url: "https://api.countrystatecity.in/v1/countries",
                type: "GET",
                headers: {
                    "X-CSCAPI-KEY":
                        "UVAwbkxwMDZJWVdkY25UNnhZS2ozTHdVM3FVUm5kODlsU0NDUG5mNA==",
                    Accept: "application/json",
                },
            });

            $.each(response, function (idx, country) {
                let mainPhoneCodeVal;
                if (countryCodeForMobile == country.iso2) {
                    mainPhoneCodeVal = country.phonecode;
                    console.log("object i got main: ", mainPhoneCodeVal); // i got 1 for US
                }

                $(".countryCodeIP")
                    .append(
                        $("<option></option>")
                            .attr("value", country.phonecode)
                            .attr("data-iso", country.iso2)
                            .text(`${country.phonecode}`)
                    )
                    .prop("selected", country.phonecode === "IN");
            });
            console.log(countryCodeForMobile, " : countryCodeForMobile");
            if (countryCodeForMobile) {
                $(".countryCodeIP option").each(function () {
                    if ($(this).attr("data-iso") === countryCodeForMobile) {
                        $(".countryCodeIP").val($(this).val());
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    }

    // Remove unnecessary currency update call for club recruitment system
    // await updateCurrency();
    await getAllCountries();
});

function validateNameInput(elementId, errorElementId, fieldName = "Name") {
    const inputValue = $(`#${elementId}`).val().trim();
    const errorElement = $(`#${errorElementId}`);
    console.log("Validating", inputValue, errorElement);
    errorElement.addClass("warning").text(`${fieldName} cannot be empty`);
    $(errorElement).css("visibility", "hidden");
    if (inputValue === "") {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text(`${fieldName} cannot be empty`);
        return false;
    }

    if (inputValue.length < 3) {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text(`${fieldName} is too short.`);
        return false;
    }

    // const namePattern = /^[A-Za-z\s]+$/;
    // if (!namePattern.test(inputValue) && fieldName !== "Message") {
    //     $(errorElement).css("visibility", "visible");
    //     errorElement
    //         .removeClass("warning")
    //         .text(`${fieldName} contains invalid characters`);
    //     return false;
    // }

    errorElement.removeClass("warning").text("");
    $(errorElement).css("visibility", "hidden");
    return true;
}

function validateEmailInput(elementId, errorElementId) {
    const inputValue = $(`#${elementId}`).val().trim();
    const errorElement = $(`#${errorElementId}`);
    console.log("Validating", inputValue, errorElement);

    if (inputValue === "") {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text("Email cannot be empty");
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(inputValue)) {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text("Invalid email address format");
        return false;
    }

    errorElement.removeClass("warning").text("");
    $(errorElement).css("visibility", "hidden");
    return true;
}

function validateMobileInput(elementId, errorElementId) {
    const inputValue = $(`#${elementId}`).val().trim();
    const errorElement = $(`#${errorElementId}`);
    console.log("Validating", inputValue, errorElement);

    errorElement.addClass("warning").text("Mobile number cannot be empty");
    $(errorElement).css("visibility", "hidden");

    if (inputValue === "") {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text("Mobile number cannot be empty");
        return false;
    }

    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(inputValue)) {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text("Mobile number must be 10 digits");
        return false;
    }

    errorElement.removeClass("warning").text("");
    $(errorElement).css("visibility", "hidden");
    return true;
}

function validateSelectInput(selectId, errorElementId) {
    const selectElement = document.getElementById(selectId);
    const selectedIndex = selectElement.selectedIndex;
    const selectedValue = selectElement.value;
    const errorElement = $(`#${errorElementId}`);
    console.log(
        "Validating selected option",
        {
            selectedValue,
            selectedIndex,
            errorElement,
            selectElement
        }
    );

    errorElement.addClass("warning").text("Please select an option");
    $(errorElement).css("visibility", "hidden");

    if (selectedIndex === 0 || !selectedValue) {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text("Please select an option");
        return false;
    }

    errorElement.removeClass("warning").text("");
    $(errorElement).css("visibility", "hidden");
    return true;
}

function validateGradeInput(elementId, errorElementId, fieldName = "Grade/Year") {
    const inputValue = $(`#${elementId}`).val().trim();
    const errorElement = $(`#${errorElementId}`);
    errorElement.addClass("warning").text(`${fieldName} cannot be empty`);
    $(errorElement).css("visibility", "hidden");

    if (inputValue === "") {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text(`${fieldName} cannot be empty`);
        return false;
    }

    if (inputValue.length < 1 || inputValue.length > 30) {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text(`${fieldName} must be between 1 and 30 characters`);
        return false;
    }

    // Accepts alphanumeric like "10", "Year 2", "Grade 11", "1st Year", etc.
    const gradePattern = /^[A-Za-z0-9\s\-]+$/;
    if (!gradePattern.test(inputValue)) {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text(`${fieldName} contains invalid characters`);
        return false;
    }

    errorElement.removeClass("warning").text("");
    $(errorElement).css("visibility", "hidden");
    return true;
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const day = date.getDate();
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];

    const suffix = (day) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };

    return `${day}${suffix(day)} ${month} | ${dayOfWeek}`;
}

const tzMap = [
    {
        "timezones": [
            "America/Aruba"
        ],
        "latlng": [
            12.5,
            -69.96666666
        ],
        "name": "Aruba",
        "country_code": "AW",
        "capital": "Oranjestad"
    },
    {
        "timezones": [
            "Asia/Kabul"
        ],
        "latlng": [
            33,
            65
        ],
        "name": "Afghanistan",
        "country_code": "AF",
        "capital": "Kabul"
    },
    {
        "timezones": [
            "Africa/Luanda"
        ],
        "latlng": [
            -12.5,
            18.5
        ],
        "name": "Angola",
        "country_code": "AO",
        "capital": "Luanda"
    },
    {
        "timezones": [
            "America/Anguilla"
        ],
        "latlng": [
            18.25,
            -63.16666666
        ],
        "name": "Anguilla",
        "country_code": "AI",
        "capital": "The Valley"
    },
    {
        "timezones": [
            "Europe/Mariehamn"
        ],
        "latlng": [
            60.116667,
            19.9
        ],
        "name": "\u00c5land Islands",
        "country_code": "AX",
        "capital": "Mariehamn"
    },
    {
        "timezones": [
            "Europe/Tirane"
        ],
        "latlng": [
            41,
            20
        ],
        "name": "Albania",
        "country_code": "AL",
        "capital": "Tirana"
    },
    {
        "timezones": [
            "Europe/Andorra"
        ],
        "latlng": [
            42.5,
            1.5
        ],
        "name": "Andorra",
        "country_code": "AD",
        "capital": "Andorra la Vella"
    },
    {
        "timezones": [
            "Asia/Dubai"
        ],
        "latlng": [
            24,
            54
        ],
        "name": "United Arab Emirates",
        "country_code": "AE",
        "capital": "Abu Dhabi"
    },
    {
        "timezones": [
            "America/Argentina/Buenos_Aires",
            "America/Argentina/Cordoba",
            "America/Argentina/Salta",
            "America/Argentina/Jujuy",
            "America/Argentina/Tucuman",
            "America/Argentina/Catamarca",
            "America/Argentina/La_Rioja",
            "America/Argentina/San_Juan",
            "America/Argentina/Mendoza",
            "America/Argentina/San_Luis",
            "America/Argentina/Rio_Gallegos",
            "America/Argentina/Ushuaia"
        ],
        "latlng": [
            -34,
            -64
        ],
        "name": "Argentina",
        "country_code": "AR",
        "capital": "Buenos Aires"
    },
    {
        "timezones": [
            "Asia/Yerevan"
        ],
        "latlng": [
            40,
            45
        ],
        "name": "Armenia",
        "country_code": "AM",
        "capital": "Yerevan"
    },
    {
        "timezones": [
            "Pacific/Pago_Pago"
        ],
        "latlng": [
            -14.33333333,
            -170
        ],
        "name": "American Samoa",
        "country_code": "AS",
        "capital": "Pago Pago"
    },
    {
        "timezones": [
            "Antarctica/McMurdo",
            "Antarctica/Casey",
            "Antarctica/Davis",
            "Antarctica/DumontDUrville",
            "Antarctica/Mawson",
            "Antarctica/Palmer",
            "Antarctica/Rothera",
            "Antarctica/Syowa",
            "Antarctica/Troll",
            "Antarctica/Vostok"
        ],
        "latlng": [
            -90,
            0
        ],
        "name": "Antarctica",
        "country_code": "AQ",
        "capital": null
    },
    {
        "timezones": [
            "Indian/Kerguelen"
        ],
        "latlng": [
            -49.25,
            69.167
        ],
        "name": "French Southern and Antarctic Lands",
        "country_code": "TF",
        "capital": "Port-aux-Fran\u00e7ais"
    },
    {
        "timezones": [
            "America/Antigua"
        ],
        "latlng": [
            17.05,
            -61.8
        ],
        "name": "Antigua and Barbuda",
        "country_code": "AG",
        "capital": "Saint John's"
    },
    {
        "timezones": [
            "Australia/Lord_Howe",
            "Antarctica/Macquarie",
            "Australia/Hobart",
            "Australia/Currie",
            "Australia/Melbourne",
            "Australia/Sydney",
            "Australia/Broken_Hill",
            "Australia/Brisbane",
            "Australia/Lindeman",
            "Australia/Adelaide",
            "Australia/Darwin",
            "Australia/Perth",
            "Australia/Eucla"
        ],
        "latlng": [
            -27,
            133
        ],
        "name": "Australia",
        "country_code": "AU",
        "capital": "Canberra"
    },
    {
        "timezones": [
            "Europe/Vienna"
        ],
        "latlng": [
            47.33333333,
            13.33333333
        ],
        "name": "Austria",
        "country_code": "AT",
        "capital": "Vienna"
    },
    {
        "timezones": [
            "Asia/Baku"
        ],
        "latlng": [
            40.5,
            47.5
        ],
        "name": "Azerbaijan",
        "country_code": "AZ",
        "capital": "Baku"
    },
    {
        "timezones": [
            "Africa/Bujumbura"
        ],
        "latlng": [
            -3.5,
            30
        ],
        "name": "Burundi",
        "country_code": "BI",
        "capital": "Bujumbura"
    },
    {
        "timezones": [
            "Europe/Brussels"
        ],
        "latlng": [
            50.83333333,
            4
        ],
        "name": "Belgium",
        "country_code": "BE",
        "capital": "Brussels"
    },
    {
        "timezones": [
            "Africa/Porto-Novo"
        ],
        "latlng": [
            9.5,
            2.25
        ],
        "name": "Benin",
        "country_code": "BJ",
        "capital": "Porto-Novo"
    },
    {
        "timezones": [
            "Africa/Ouagadougou"
        ],
        "latlng": [
            13,
            -2
        ],
        "name": "Burkina Faso",
        "country_code": "BF",
        "capital": "Ouagadougou"
    },
    {
        "timezones": [
            "Asia/Dhaka"
        ],
        "latlng": [
            24,
            90
        ],
        "name": "Bangladesh",
        "country_code": "BD",
        "capital": "Dhaka"
    },
    {
        "timezones": [
            "Europe/Sofia"
        ],
        "latlng": [
            43,
            25
        ],
        "name": "Bulgaria",
        "country_code": "BG",
        "capital": "Sofia"
    },
    {
        "timezones": [
            "Asia/Bahrain"
        ],
        "latlng": [
            26,
            50.55
        ],
        "name": "Bahrain",
        "country_code": "BH",
        "capital": "Manama"
    },
    {
        "timezones": [
            "America/Nassau"
        ],
        "latlng": [
            24.25,
            -76
        ],
        "name": "Bahamas",
        "country_code": "BS",
        "capital": "Nassau"
    },
    {
        "timezones": [
            "Europe/Sarajevo"
        ],
        "latlng": [
            44,
            18
        ],
        "name": "Bosnia and Herzegovina",
        "country_code": "BA",
        "capital": "Sarajevo"
    },
    {
        "timezones": [
            "America/St_Barthelemy"
        ],
        "latlng": [
            18.5,
            -63.41666666
        ],
        "name": "Saint Barth\u00e9lemy",
        "country_code": "BL",
        "capital": "Gustavia"
    },
    {
        "timezones": [
            "Europe/Minsk"
        ],
        "latlng": [
            53,
            28
        ],
        "name": "Belarus",
        "country_code": "BY",
        "capital": "Minsk"
    },
    {
        "timezones": [
            "America/Belize"
        ],
        "latlng": [
            17.25,
            -88.75
        ],
        "name": "Belize",
        "country_code": "BZ",
        "capital": "Belmopan"
    },
    {
        "timezones": [
            "Atlantic/Bermuda"
        ],
        "latlng": [
            32.33333333,
            -64.75
        ],
        "name": "Bermuda",
        "country_code": "BM",
        "capital": "Hamilton"
    },
    {
        "timezones": [
            "America/La_Paz"
        ],
        "latlng": [
            -17,
            -65
        ],
        "name": "Bolivia",
        "country_code": "BO",
        "capital": "Sucre"
    },
    {
        "timezones": [
            "America/Noronha",
            "America/Belem",
            "America/Fortaleza",
            "America/Recife",
            "America/Araguaina",
            "America/Maceio",
            "America/Bahia",
            "America/Sao_Paulo",
            "America/Campo_Grande",
            "America/Cuiaba",
            "America/Santarem",
            "America/Porto_Velho",
            "America/Boa_Vista",
            "America/Manaus",
            "America/Eirunepe",
            "America/Rio_Branco"
        ],
        "latlng": [
            -10,
            -55
        ],
        "name": "Brazil",
        "country_code": "BR",
        "capital": "Bras\u00edlia"
    },
    {
        "timezones": [
            "America/Barbados"
        ],
        "latlng": [
            13.16666666,
            -59.53333333
        ],
        "name": "Barbados",
        "country_code": "BB",
        "capital": "Bridgetown"
    },
    {
        "timezones": [
            "Asia/Brunei"
        ],
        "latlng": [
            4.5,
            114.66666666
        ],
        "name": "Brunei",
        "country_code": "BN",
        "capital": "Bandar Seri Begawan"
    },
    {
        "timezones": [
            "Asia/Thimphu"
        ],
        "latlng": [
            27.5,
            90.5
        ],
        "name": "Bhutan",
        "country_code": "BT",
        "capital": "Thimphu"
    },
    {
        "timezones": [
            "Europe/Oslo"
        ],
        "latlng": [
            -54.43333333,
            3.4
        ],
        "name": "Bouvet Island",
        "country_code": "BV",
        "capital": null
    },
    {
        "timezones": [
            "Africa/Gaborone"
        ],
        "latlng": [
            -22,
            24
        ],
        "name": "Botswana",
        "country_code": "BW",
        "capital": "Gaborone"
    },
    {
        "timezones": [
            "Africa/Bangui"
        ],
        "latlng": [
            7,
            21
        ],
        "name": "Central African Republic",
        "country_code": "CF",
        "capital": "Bangui"
    },
    {
        "timezones": [
            "America/St_Johns",
            "America/Halifax",
            "America/Glace_Bay",
            "America/Moncton",
            "America/Goose_Bay",
            "America/Blanc-Sablon",
            "America/Toronto",
            "America/Nipigon",
            "America/Thunder_Bay",
            "America/Iqaluit",
            "America/Pangnirtung",
            "America/Atikokan",
            "America/Winnipeg",
            "America/Rainy_River",
            "America/Resolute",
            "America/Rankin_Inlet",
            "America/Regina",
            "America/Swift_Current",
            "America/Edmonton",
            "America/Cambridge_Bay",
            "America/Yellowknife",
            "America/Inuvik",
            "America/Creston",
            "America/Dawson_Creek",
            "America/Fort_Nelson",
            "America/Vancouver",
            "America/Whitehorse",
            "America/Dawson"
        ],
        "latlng": [
            60,
            -95
        ],
        "name": "Canada",
        "country_code": "CA",
        "capital": "Ottawa"
    },
    {
        "timezones": [
            "Indian/Cocos"
        ],
        "latlng": [
            -12.5,
            96.83333333
        ],
        "name": "Cocos (Keeling) Islands",
        "country_code": "CC",
        "capital": "West Island"
    },
    {
        "timezones": [
            "Europe/Zurich"
        ],
        "latlng": [
            47,
            8
        ],
        "name": "Switzerland",
        "country_code": "CH",
        "capital": "Bern"
    },
    {
        "timezones": [
            "America/Santiago",
            "Pacific/Easter"
        ],
        "latlng": [
            -30,
            -71
        ],
        "name": "Chile",
        "country_code": "CL",
        "capital": "Santiago"
    },
    {
        "timezones": [
            "Asia/Shanghai",
            "Asia/Urumqi"
        ],
        "latlng": [
            35,
            105
        ],
        "name": "China",
        "country_code": "CN",
        "capital": "Beijing"
    },
    {
        "timezones": [
            "Africa/Abidjan"
        ],
        "latlng": [
            8,
            -5
        ],
        "name": "Ivory Coast",
        "country_code": "CI",
        "capital": "Yamoussoukro"
    },
    {
        "timezones": [
            "Africa/Douala"
        ],
        "latlng": [
            6,
            12
        ],
        "name": "Cameroon",
        "country_code": "CM",
        "capital": "Yaound\u00e9"
    },
    {
        "timezones": [
            "Africa/Kinshasa",
            "Africa/Lubumbashi"
        ],
        "latlng": [
            0,
            25
        ],
        "name": "DR Congo",
        "country_code": "CD",
        "capital": "Kinshasa"
    },
    {
        "timezones": [
            "Africa/Brazzaville"
        ],
        "latlng": [
            -1,
            15
        ],
        "name": "Republic of the Congo",
        "country_code": "CG",
        "capital": "Brazzaville"
    },
    {
        "timezones": [
            "Pacific/Rarotonga"
        ],
        "latlng": [
            -21.23333333,
            -159.76666666
        ],
        "name": "Cook Islands",
        "country_code": "CK",
        "capital": "Avarua"
    },
    {
        "timezones": [
            "America/Bogota"
        ],
        "latlng": [
            4,
            -72
        ],
        "name": "Colombia",
        "country_code": "CO",
        "capital": "Bogot\u00e1"
    },
    {
        "timezones": [
            "Indian/Comoro"
        ],
        "latlng": [
            -12.16666666,
            44.25
        ],
        "name": "Comoros",
        "country_code": "KM",
        "capital": "Moroni"
    },
    {
        "timezones": [
            "Atlantic/Cape_Verde"
        ],
        "latlng": [
            16,
            -24
        ],
        "name": "Cape Verde",
        "country_code": "CV",
        "capital": "Praia"
    },
    {
        "timezones": [
            "America/Costa_Rica"
        ],
        "latlng": [
            10,
            -84
        ],
        "name": "Costa Rica",
        "country_code": "CR",
        "capital": "San Jos\u00e9"
    },
    {
        "timezones": [
            "America/Havana"
        ],
        "latlng": [
            21.5,
            -80
        ],
        "name": "Cuba",
        "country_code": "CU",
        "capital": "Havana"
    },
    {
        "timezones": [
            "America/Curacao"
        ],
        "latlng": [
            12.116667,
            -68.933333
        ],
        "name": "Cura\u00e7ao",
        "country_code": "CW",
        "capital": "Willemstad"
    },
    {
        "timezones": [
            "Indian/Christmas"
        ],
        "latlng": [
            -10.5,
            105.66666666
        ],
        "name": "Christmas Island",
        "country_code": "CX",
        "capital": "Flying Fish Cove"
    },
    {
        "timezones": [
            "America/Cayman"
        ],
        "latlng": [
            19.5,
            -80.5
        ],
        "name": "Cayman Islands",
        "country_code": "KY",
        "capital": "George Town"
    },
    {
        "timezones": [
            "Asia/Nicosia"
        ],
        "latlng": [
            35,
            33
        ],
        "name": "Cyprus",
        "country_code": "CY",
        "capital": "Nicosia"
    },
    {
        "timezones": [
            "Europe/Prague"
        ],
        "latlng": [
            49.75,
            15.5
        ],
        "name": "Czech Republic",
        "country_code": "CZ",
        "capital": "Prague"
    },
    {
        "timezones": [
            "Europe/Berlin",
            "Europe/Busingen"
        ],
        "latlng": [
            51,
            9
        ],
        "name": "Germany",
        "country_code": "DE",
        "capital": "Berlin"
    },
    {
        "timezones": [
            "Africa/Djibouti"
        ],
        "latlng": [
            11.5,
            43
        ],
        "name": "Djibouti",
        "country_code": "DJ",
        "capital": "Djibouti"
    },
    {
        "timezones": [
            "America/Dominica"
        ],
        "latlng": [
            15.41666666,
            -61.33333333
        ],
        "name": "Dominica",
        "country_code": "DM",
        "capital": "Roseau"
    },
    {
        "timezones": [
            "Europe/Copenhagen"
        ],
        "latlng": [
            56,
            10
        ],
        "name": "Denmark",
        "country_code": "DK",
        "capital": "Copenhagen"
    },
    {
        "timezones": [
            "America/Santo_Domingo"
        ],
        "latlng": [
            19,
            -70.66666666
        ],
        "name": "Dominican Republic",
        "country_code": "DO",
        "capital": "Santo Domingo"
    },
    {
        "timezones": [
            "Africa/Algiers"
        ],
        "latlng": [
            28,
            3
        ],
        "name": "Algeria",
        "country_code": "DZ",
        "capital": "Algiers"
    },
    {
        "timezones": [
            "America/Guayaquil",
            "Pacific/Galapagos"
        ],
        "latlng": [
            -2,
            -77.5
        ],
        "name": "Ecuador",
        "country_code": "EC",
        "capital": "Quito"
    },
    {
        "timezones": [
            "Africa/Cairo"
        ],
        "latlng": [
            27,
            30
        ],
        "name": "Egypt",
        "country_code": "EG",
        "capital": "Cairo"
    },
    {
        "timezones": [
            "Africa/Asmara"
        ],
        "latlng": [
            15,
            39
        ],
        "name": "Eritrea",
        "country_code": "ER",
        "capital": "Asmara"
    },
    {
        "timezones": [
            "Africa/El_Aaiun"
        ],
        "latlng": [
            24.5,
            -13
        ],
        "name": "Western Sahara",
        "country_code": "EH",
        "capital": "El Aai\u00fan"
    },
    {
        "timezones": [
            "Europe/Madrid",
            "Africa/Ceuta",
            "Atlantic/Canary"
        ],
        "latlng": [
            40,
            -4
        ],
        "name": "Spain",
        "country_code": "ES",
        "capital": "Madrid"
    },
    {
        "timezones": [
            "Europe/Tallinn"
        ],
        "latlng": [
            59,
            26
        ],
        "name": "Estonia",
        "country_code": "EE",
        "capital": "Tallinn"
    },
    {
        "timezones": [
            "Africa/Addis_Ababa"
        ],
        "latlng": [
            8,
            38
        ],
        "name": "Ethiopia",
        "country_code": "ET",
        "capital": "Addis Ababa"
    },
    {
        "timezones": [
            "Europe/Helsinki"
        ],
        "latlng": [
            64,
            26
        ],
        "name": "Finland",
        "country_code": "FI",
        "capital": "Helsinki"
    },
    {
        "timezones": [
            "Pacific/Fiji"
        ],
        "latlng": [
            -18,
            175
        ],
        "name": "Fiji",
        "country_code": "FJ",
        "capital": "Suva"
    },
    {
        "timezones": [
            "Atlantic/Stanley"
        ],
        "latlng": [
            -51.75,
            -59
        ],
        "name": "Falkland Islands",
        "country_code": "FK",
        "capital": "Stanley"
    },
    {
        "timezones": [
            "Europe/Paris"
        ],
        "latlng": [
            46,
            2
        ],
        "name": "France",
        "country_code": "FR",
        "capital": "Paris"
    },
    {
        "timezones": [
            "Atlantic/Faroe"
        ],
        "latlng": [
            62,
            -7
        ],
        "name": "Faroe Islands",
        "country_code": "FO",
        "capital": "T\u00f3rshavn"
    },
    {
        "timezones": [
            "Pacific/Chuuk",
            "Pacific/Pohnpei",
            "Pacific/Kosrae"
        ],
        "latlng": [
            6.91666666,
            158.25
        ],
        "name": "Micronesia",
        "country_code": "FM",
        "capital": "Palikir"
    },
    {
        "timezones": [
            "Africa/Libreville"
        ],
        "latlng": [
            -1,
            11.75
        ],
        "name": "Gabon",
        "country_code": "GA",
        "capital": "Libreville"
    },
    {
        "timezones": [
            "Europe/London"
        ],
        "latlng": [
            54,
            -2
        ],
        "name": "United Kingdom",
        "country_code": "GB",
        "capital": "London"
    },
    {
        "timezones": [
            "Asia/Tbilisi"
        ],
        "latlng": [
            42,
            43.5
        ],
        "name": "Georgia",
        "country_code": "GE",
        "capital": "Tbilisi"
    },
    {
        "timezones": [
            "Europe/Guernsey"
        ],
        "latlng": [
            49.46666666,
            -2.58333333
        ],
        "name": "Guernsey",
        "country_code": "GG",
        "capital": "St. Peter Port"
    },
    {
        "timezones": [
            "Africa/Accra"
        ],
        "latlng": [
            8,
            -2
        ],
        "name": "Ghana",
        "country_code": "GH",
        "capital": "Accra"
    },
    {
        "timezones": [
            "Europe/Gibraltar"
        ],
        "latlng": [
            36.13333333,
            -5.35
        ],
        "name": "Gibraltar",
        "country_code": "GI",
        "capital": "Gibraltar"
    },
    {
        "timezones": [
            "Africa/Conakry"
        ],
        "latlng": [
            11,
            -10
        ],
        "name": "Guinea",
        "country_code": "GN",
        "capital": "Conakry"
    },
    {
        "timezones": [
            "America/Guadeloupe"
        ],
        "latlng": [
            16.25,
            -61.583333
        ],
        "name": "Guadeloupe",
        "country_code": "GP",
        "capital": "Basse-Terre"
    },
    {
        "timezones": [
            "Africa/Banjul"
        ],
        "latlng": [
            13.46666666,
            -16.56666666
        ],
        "name": "Gambia",
        "country_code": "GM",
        "capital": "Banjul"
    },
    {
        "timezones": [
            "Africa/Bissau"
        ],
        "latlng": [
            12,
            -15
        ],
        "name": "Guinea-Bissau",
        "country_code": "GW",
        "capital": "Bissau"
    },
    {
        "timezones": [
            "Africa/Malabo"
        ],
        "latlng": [
            2,
            10
        ],
        "name": "Equatorial Guinea",
        "country_code": "GQ",
        "capital": "Malabo"
    },
    {
        "timezones": [
            "Europe/Athens"
        ],
        "latlng": [
            39,
            22
        ],
        "name": "Greece",
        "country_code": "GR",
        "capital": "Athens"
    },
    {
        "timezones": [
            "America/Grenada"
        ],
        "latlng": [
            12.11666666,
            -61.66666666
        ],
        "name": "Grenada",
        "country_code": "GD",
        "capital": "St. George's"
    },
    {
        "timezones": [
            "America/Godthab",
            "America/Danmarkshavn",
            "America/Scoresbysund",
            "America/Thule"
        ],
        "latlng": [
            72,
            -40
        ],
        "name": "Greenland",
        "country_code": "GL",
        "capital": "Nuuk"
    },
    {
        "timezones": [
            "America/Guatemala"
        ],
        "latlng": [
            15.5,
            -90.25
        ],
        "name": "Guatemala",
        "country_code": "GT",
        "capital": "Guatemala City"
    },
    {
        "timezones": [
            "America/Cayenne"
        ],
        "latlng": [
            4,
            -53
        ],
        "name": "French Guiana",
        "country_code": "GF",
        "capital": "Cayenne"
    },
    {
        "timezones": [
            "Pacific/Guam"
        ],
        "latlng": [
            13.46666666,
            144.78333333
        ],
        "name": "Guam",
        "country_code": "GU",
        "capital": "Hag\u00e5t\u00f1a"
    },
    {
        "timezones": [
            "America/Guyana"
        ],
        "latlng": [
            5,
            -59
        ],
        "name": "Guyana",
        "country_code": "GY",
        "capital": "Georgetown"
    },
    {
        "timezones": [
            "Asia/Hong_Kong"
        ],
        "latlng": [
            22.267,
            114.188
        ],
        "name": "Hong Kong",
        "country_code": "HK",
        "capital": "City of Victoria"
    },
    {
        "timezones": [
            "America/Tegucigalpa"
        ],
        "latlng": [
            15,
            -86.5
        ],
        "name": "Honduras",
        "country_code": "HN",
        "capital": "Tegucigalpa"
    },
    {
        "timezones": [
            "Europe/Zagreb"
        ],
        "latlng": [
            45.16666666,
            15.5
        ],
        "name": "Croatia",
        "country_code": "HR",
        "capital": "Zagreb"
    },
    {
        "timezones": [
            "America/Port-au-Prince"
        ],
        "latlng": [
            19,
            -72.41666666
        ],
        "name": "Haiti",
        "country_code": "HT",
        "capital": "Port-au-Prince"
    },
    {
        "timezones": [
            "Europe/Budapest"
        ],
        "latlng": [
            47,
            20
        ],
        "name": "Hungary",
        "country_code": "HU",
        "capital": "Budapest"
    },
    {
        "timezones": [
            "Asia/Jakarta",
            "Asia/Pontianak",
            "Asia/Makassar",
            "Asia/Jayapura"
        ],
        "latlng": [
            -5,
            120
        ],
        "name": "Indonesia",
        "country_code": "ID",
        "capital": "Jakarta"
    },
    {
        "timezones": [
            "Europe/Isle_of_Man"
        ],
        "latlng": [
            54.25,
            -4.5
        ],
        "name": "Isle of Man",
        "country_code": "IM",
        "capital": "Douglas"
    },
    {
        "timezones": [
            "Asia/Kolkata"
        ],
        "latlng": [
            20,
            77
        ],
        "name": "India",
        "country_code": "IN",
        "capital": "New Delhi"
    },
    {
        "timezones": [
            "Indian/Chagos"
        ],
        "latlng": [
            -6,
            71.5
        ],
        "name": "British Indian Ocean Territory",
        "country_code": "IO",
        "capital": "Diego Garcia"
    },
    {
        "timezones": [
            "Europe/Dublin"
        ],
        "latlng": [
            53,
            -8
        ],
        "name": "Ireland",
        "country_code": "IE",
        "capital": "Dublin"
    },
    {
        "timezones": [
            "Asia/Tehran"
        ],
        "latlng": [
            32,
            53
        ],
        "name": "Iran",
        "country_code": "IR",
        "capital": "Tehran"
    },
    {
        "timezones": [
            "Asia/Baghdad"
        ],
        "latlng": [
            33,
            44
        ],
        "name": "Iraq",
        "country_code": "IQ",
        "capital": "Baghdad"
    },
    {
        "timezones": [
            "Atlantic/Reykjavik"
        ],
        "latlng": [
            65,
            -18
        ],
        "name": "Iceland",
        "country_code": "IS",
        "capital": "Reykjavik"
    },
    {
        "timezones": [
            "Asia/Jerusalem"
        ],
        "latlng": [
            31.47,
            35.13
        ],
        "name": "Israel",
        "country_code": "IL",
        "capital": "Jerusalem"
    },
    {
        "timezones": [
            "Europe/Rome"
        ],
        "latlng": [
            42.83333333,
            12.83333333
        ],
        "name": "Italy",
        "country_code": "IT",
        "capital": "Rome"
    },
    {
        "timezones": [
            "America/Jamaica"
        ],
        "latlng": [
            18.25,
            -77.5
        ],
        "name": "Jamaica",
        "country_code": "JM",
        "capital": "Kingston"
    },
    {
        "timezones": [
            "Europe/Jersey"
        ],
        "latlng": [
            49.25,
            -2.16666666
        ],
        "name": "Jersey",
        "country_code": "JE",
        "capital": "Saint Helier"
    },
    {
        "timezones": [
            "Asia/Amman"
        ],
        "latlng": [
            31,
            36
        ],
        "name": "Jordan",
        "country_code": "JO",
        "capital": "Amman"
    },
    {
        "timezones": [
            "Asia/Tokyo"
        ],
        "latlng": [
            36,
            138
        ],
        "name": "Japan",
        "country_code": "JP",
        "capital": "Tokyo"
    },
    {
        "timezones": [
            "Asia/Almaty",
            "Asia/Qyzylorda",
            "Asia/Aqtobe",
            "Asia/Aqtau",
            "Asia/Oral"
        ],
        "latlng": [
            48,
            68
        ],
        "name": "Kazakhstan",
        "country_code": "KZ",
        "capital": "Astana"
    },
    {
        "timezones": [
            "Africa/Nairobi"
        ],
        "latlng": [
            1,
            38
        ],
        "name": "Kenya",
        "country_code": "KE",
        "capital": "Nairobi"
    },
    {
        "timezones": [
            "Asia/Bishkek"
        ],
        "latlng": [
            41,
            75
        ],
        "name": "Kyrgyzstan",
        "country_code": "KG",
        "capital": "Bishkek"
    },
    {
        "timezones": [
            "Asia/Phnom_Penh"
        ],
        "latlng": [
            13,
            105
        ],
        "name": "Cambodia",
        "country_code": "KH",
        "capital": "Phnom Penh"
    },
    {
        "timezones": [
            "Pacific/Tarawa",
            "Pacific/Enderbury",
            "Pacific/Kiritimati"
        ],
        "latlng": [
            1.41666666,
            173
        ],
        "name": "Kiribati",
        "country_code": "KI",
        "capital": "South Tarawa"
    },
    {
        "timezones": [
            "America/St_Kitts"
        ],
        "latlng": [
            17.33333333,
            -62.75
        ],
        "name": "Saint Kitts and Nevis",
        "country_code": "KN",
        "capital": "Basseterre"
    },
    {
        "timezones": [
            "Asia/Seoul"
        ],
        "latlng": [
            37,
            127.5
        ],
        "name": "South Korea",
        "country_code": "KR",
        "capital": "Seoul"
    },
    {
        "timezones": ["Europe/Belgrade"],
        "latlng": [
            42.666667,
            21.166667
        ],
        "name": "Kosovo",
        "country_code": "XK",
        "capital": "Pristina"
    },
    {
        "timezones": [
            "Asia/Kuwait"
        ],
        "latlng": [
            29.5,
            45.75
        ],
        "name": "Kuwait",
        "country_code": "KW",
        "capital": "Kuwait City"
    },
    {
        "timezones": [
            "Asia/Vientiane"
        ],
        "latlng": [
            18,
            105
        ],
        "name": "Laos",
        "country_code": "LA",
        "capital": "Vientiane"
    },
    {
        "timezones": [
            "Asia/Beirut"
        ],
        "latlng": [
            33.83333333,
            35.83333333
        ],
        "name": "Lebanon",
        "country_code": "LB",
        "capital": "Beirut"
    },
    {
        "timezones": [
            "Africa/Monrovia"
        ],
        "latlng": [
            6.5,
            -9.5
        ],
        "name": "Liberia",
        "country_code": "LR",
        "capital": "Monrovia"
    },
    {
        "timezones": [
            "Africa/Tripoli"
        ],
        "latlng": [
            25,
            17
        ],
        "name": "Libya",
        "country_code": "LY",
        "capital": "Tripoli"
    },
    {
        "timezones": [
            "America/St_Lucia"
        ],
        "latlng": [
            13.88333333,
            -60.96666666
        ],
        "name": "Saint Lucia",
        "country_code": "LC",
        "capital": "Castries"
    },
    {
        "timezones": [
            "Europe/Vaduz"
        ],
        "latlng": [
            47.26666666,
            9.53333333
        ],
        "name": "Liechtenstein",
        "country_code": "LI",
        "capital": "Vaduz"
    },
    {
        "timezones": [
            "Asia/Colombo"
        ],
        "latlng": [
            7,
            81
        ],
        "name": "Sri Lanka",
        "country_code": "LK",
        "capital": "Colombo"
    },
    {
        "timezones": [
            "Africa/Maseru"
        ],
        "latlng": [
            -29.5,
            28.5
        ],
        "name": "Lesotho",
        "country_code": "LS",
        "capital": "Maseru"
    },
    {
        "timezones": [
            "Europe/Vilnius"
        ],
        "latlng": [
            56,
            24
        ],
        "name": "Lithuania",
        "country_code": "LT",
        "capital": "Vilnius"
    },
    {
        "timezones": [
            "Europe/Luxembourg"
        ],
        "latlng": [
            49.75,
            6.16666666
        ],
        "name": "Luxembourg",
        "country_code": "LU",
        "capital": "Luxembourg"
    },
    {
        "timezones": [
            "Europe/Riga"
        ],
        "latlng": [
            57,
            25
        ],
        "name": "Latvia",
        "country_code": "LV",
        "capital": "Riga"
    },
    {
        "timezones": [
            "Asia/Macau"
        ],
        "latlng": [
            22.16666666,
            113.55
        ],
        "name": "Macau",
        "country_code": "MO",
        "capital": null
    },
    {
        "timezones": [
            "America/Marigot"
        ],
        "latlng": [
            18.08333333,
            -63.95
        ],
        "name": "Saint Martin",
        "country_code": "MF",
        "capital": "Marigot"
    },
    {
        "timezones": [
            "Africa/Casablanca"
        ],
        "latlng": [
            32,
            -5
        ],
        "name": "Morocco",
        "country_code": "MA",
        "capital": "Rabat"
    },
    {
        "timezones": [
            "Europe/Monaco"
        ],
        "latlng": [
            43.73333333,
            7.4
        ],
        "name": "Monaco",
        "country_code": "MC",
        "capital": "Monaco"
    },
    {
        "timezones": [
            "Europe/Chisinau"
        ],
        "latlng": [
            47,
            29
        ],
        "name": "Moldova",
        "country_code": "MD",
        "capital": "Chi\u0219in\u0103u"
    },
    {
        "timezones": [
            "Indian/Antananarivo"
        ],
        "latlng": [
            -20,
            47
        ],
        "name": "Madagascar",
        "country_code": "MG",
        "capital": "Antananarivo"
    },
    {
        "timezones": [
            "Indian/Maldives"
        ],
        "latlng": [
            3.25,
            73
        ],
        "name": "Maldives",
        "country_code": "MV",
        "capital": "Mal\u00e9"
    },
    {
        "timezones": [
            "America/Mexico_City",
            "America/Cancun",
            "America/Merida",
            "America/Monterrey",
            "America/Matamoros",
            "America/Mazatlan",
            "America/Chihuahua",
            "America/Ojinaga",
            "America/Hermosillo",
            "America/Tijuana",
            "America/Bahia_Banderas"
        ],
        "latlng": [
            23,
            -102
        ],
        "name": "Mexico",
        "country_code": "MX",
        "capital": "Mexico City"
    },
    {
        "timezones": [
            "Pacific/Majuro",
            "Pacific/Kwajalein"
        ],
        "latlng": [
            9,
            168
        ],
        "name": "Marshall Islands",
        "country_code": "MH",
        "capital": "Majuro"
    },
    {
        "timezones": [
            "Europe/Skopje"
        ],
        "latlng": [
            41.83333333,
            22
        ],
        "name": "Macedonia",
        "country_code": "MK",
        "capital": "Skopje"
    },
    {
        "timezones": [
            "Africa/Bamako"
        ],
        "latlng": [
            17,
            -4
        ],
        "name": "Mali",
        "country_code": "ML",
        "capital": "Bamako"
    },
    {
        "timezones": [
            "Europe/Malta"
        ],
        "latlng": [
            35.83333333,
            14.58333333
        ],
        "name": "Malta",
        "country_code": "MT",
        "capital": "Valletta"
    },
    {
        "timezones": [
            "Asia/Rangoon"
        ],
        "latlng": [
            22,
            98
        ],
        "name": "Myanmar",
        "country_code": "MM",
        "capital": "Naypyidaw"
    },
    {
        "timezones": [
            "Europe/Podgorica"
        ],
        "latlng": [
            42.5,
            19.3
        ],
        "name": "Montenegro",
        "country_code": "ME",
        "capital": "Podgorica"
    },
    {
        "timezones": [
            "Asia/Ulaanbaatar",
            "Asia/Hovd",
            "Asia/Choibalsan"
        ],
        "latlng": [
            46,
            105
        ],
        "name": "Mongolia",
        "country_code": "MN",
        "capital": "Ulan Bator"
    },
    {
        "timezones": [
            "Pacific/Saipan"
        ],
        "latlng": [
            15.2,
            145.75
        ],
        "name": "Northern Mariana Islands",
        "country_code": "MP",
        "capital": "Saipan"
    },
    {
        "timezones": [
            "Africa/Maputo"
        ],
        "latlng": [
            -18.25,
            35
        ],
        "name": "Mozambique",
        "country_code": "MZ",
        "capital": "Maputo"
    },
    {
        "timezones": [
            "Africa/Nouakchott"
        ],
        "latlng": [
            20,
            -12
        ],
        "name": "Mauritania",
        "country_code": "MR",
        "capital": "Nouakchott"
    },
    {
        "timezones": [
            "America/Montserrat"
        ],
        "latlng": [
            16.75,
            -62.2
        ],
        "name": "Montserrat",
        "country_code": "MS",
        "capital": "Plymouth"
    },
    {
        "timezones": [
            "America/Martinique"
        ],
        "latlng": [
            14.666667,
            -61
        ],
        "name": "Martinique",
        "country_code": "MQ",
        "capital": "Fort-de-France"
    },
    {
        "timezones": [
            "Indian/Mauritius"
        ],
        "latlng": [
            -20.28333333,
            57.55
        ],
        "name": "Mauritius",
        "country_code": "MU",
        "capital": "Port Louis"
    },
    {
        "timezones": [
            "Africa/Blantyre"
        ],
        "latlng": [
            -13.5,
            34
        ],
        "name": "Malawi",
        "country_code": "MW",
        "capital": "Lilongwe"
    },
    {
        "timezones": [
            "Asia/Kuala_Lumpur",
            "Asia/Kuching"
        ],
        "latlng": [
            2.5,
            112.5
        ],
        "name": "Malaysia",
        "country_code": "MY",
        "capital": "Kuala Lumpur"
    },
    {
        "timezones": [
            "Indian/Mayotte"
        ],
        "latlng": [
            -12.83333333,
            45.16666666
        ],
        "name": "Mayotte",
        "country_code": "YT",
        "capital": "Mamoudzou"
    },
    {
        "timezones": [
            "Africa/Windhoek"
        ],
        "latlng": [
            -22,
            17
        ],
        "name": "Namibia",
        "country_code": "NA",
        "capital": "Windhoek"
    },
    {
        "timezones": [
            "Pacific/Noumea"
        ],
        "latlng": [
            -21.5,
            165.5
        ],
        "name": "New Caledonia",
        "country_code": "NC",
        "capital": "Noum\u00e9a"
    },
    {
        "timezones": [
            "Africa/Niamey"
        ],
        "latlng": [
            16,
            8
        ],
        "name": "Niger",
        "country_code": "NE",
        "capital": "Niamey"
    },
    {
        "timezones": [
            "Pacific/Norfolk"
        ],
        "latlng": [
            -29.03333333,
            167.95
        ],
        "name": "Norfolk Island",
        "country_code": "NF",
        "capital": "Kingston"
    },
    {
        "timezones": [
            "Africa/Lagos"
        ],
        "latlng": [
            10,
            8
        ],
        "name": "Nigeria",
        "country_code": "NG",
        "capital": "Abuja"
    },
    {
        "timezones": [
            "America/Managua"
        ],
        "latlng": [
            13,
            -85
        ],
        "name": "Nicaragua",
        "country_code": "NI",
        "capital": "Managua"
    },
    {
        "timezones": [
            "Pacific/Niue"
        ],
        "latlng": [
            -19.03333333,
            -169.86666666
        ],
        "name": "Niue",
        "country_code": "NU",
        "capital": "Alofi"
    },
    {
        "timezones": [
            "Europe/Amsterdam"
        ],
        "latlng": [
            52.5,
            5.75
        ],
        "name": "Netherlands",
        "country_code": "NL",
        "capital": "Amsterdam"
    },
    {
        "timezones": [
            "Europe/Oslo"
        ],
        "latlng": [
            62,
            10
        ],
        "name": "Norway",
        "country_code": "NO",
        "capital": "Oslo"
    },
    {
        "timezones": [
            "Asia/Kathmandu"
        ],
        "latlng": [
            28,
            84
        ],
        "name": "Nepal",
        "country_code": "NP",
        "capital": "Kathmandu"
    },
    {
        "timezones": [
            "Pacific/Nauru"
        ],
        "latlng": [
            -0.53333333,
            166.91666666
        ],
        "name": "Nauru",
        "country_code": "NR",
        "capital": "Yaren"
    },
    {
        "timezones": [
            "Pacific/Auckland",
            "Pacific/Chatham"
        ],
        "latlng": [
            -41,
            174
        ],
        "name": "New Zealand",
        "country_code": "NZ",
        "capital": "Wellington"
    },
    {
        "timezones": [
            "Asia/Muscat"
        ],
        "latlng": [
            21,
            57
        ],
        "name": "Oman",
        "country_code": "OM",
        "capital": "Muscat"
    },
    {
        "timezones": [
            "Asia/Karachi"
        ],
        "latlng": [
            30,
            70
        ],
        "name": "Pakistan",
        "country_code": "PK",
        "capital": "Islamabad"
    },
    {
        "timezones": [
            "America/Panama"
        ],
        "latlng": [
            9,
            -80
        ],
        "name": "Panama",
        "country_code": "PA",
        "capital": "Panama City"
    },
    {
        "timezones": [
            "Pacific/Pitcairn"
        ],
        "latlng": [
            -25.06666666,
            -130.1
        ],
        "name": "Pitcairn Islands",
        "country_code": "PN",
        "capital": "Adamstown"
    },
    {
        "timezones": [
            "America/Lima"
        ],
        "latlng": [
            -10,
            -76
        ],
        "name": "Peru",
        "country_code": "PE",
        "capital": "Lima"
    },
    {
        "timezones": [
            "Asia/Manila"
        ],
        "latlng": [
            13,
            122
        ],
        "name": "Philippines",
        "country_code": "PH",
        "capital": "Manila"
    },
    {
        "timezones": [
            "Pacific/Palau"
        ],
        "latlng": [
            7.5,
            134.5
        ],
        "name": "Palau",
        "country_code": "PW",
        "capital": "Ngerulmud"
    },
    {
        "timezones": [
            "Pacific/Port_Moresby",
            "Pacific/Bougainville"
        ],
        "latlng": [
            -6,
            147
        ],
        "name": "Papua New Guinea",
        "country_code": "PG",
        "capital": "Port Moresby"
    },
    {
        "timezones": [
            "Europe/Warsaw"
        ],
        "latlng": [
            52,
            20
        ],
        "name": "Poland",
        "country_code": "PL",
        "capital": "Warsaw"
    },
    {
        "timezones": [
            "America/Puerto_Rico"
        ],
        "latlng": [
            18.25,
            -66.5
        ],
        "name": "Puerto Rico",
        "country_code": "PR",
        "capital": "San Juan"
    },
    {
        "timezones": [
            "Asia/Pyongyang"
        ],
        "latlng": [
            40,
            127
        ],
        "name": "North Korea",
        "country_code": "KP",
        "capital": "Pyongyang"
    },
    {
        "timezones": [
            "Europe/Lisbon",
            "Atlantic/Madeira",
            "Atlantic/Azores"
        ],
        "latlng": [
            39.5,
            -8
        ],
        "name": "Portugal",
        "country_code": "PT",
        "capital": "Lisbon"
    },
    {
        "timezones": [
            "America/Asuncion"
        ],
        "latlng": [
            -23,
            -58
        ],
        "name": "Paraguay",
        "country_code": "PY",
        "capital": "Asunci\u00f3n"
    },
    {
        "timezones": [
            "Asia/Gaza",
            "Asia/Hebron"
        ],
        "latlng": [
            31.9,
            35.2
        ],
        "name": "Palestine",
        "country_code": "PS",
        "capital": "Ramallah"
    },
    {
        "timezones": [
            "Pacific/Tahiti",
            "Pacific/Marquesas",
            "Pacific/Gambier"
        ],
        "latlng": [
            -15,
            -140
        ],
        "name": "French Polynesia",
        "country_code": "PF",
        "capital": "Papeet\u0113"
    },
    {
        "timezones": [
            "Asia/Qatar"
        ],
        "latlng": [
            25.5,
            51.25
        ],
        "name": "Qatar",
        "country_code": "QA",
        "capital": "Doha"
    },
    {
        "timezones": [
            "Indian/Reunion"
        ],
        "latlng": [
            -21.15,
            55.5
        ],
        "name": "R\u00e9union",
        "country_code": "RE",
        "capital": "Saint-Denis"
    },
    {
        "timezones": [
            "Europe/Bucharest"
        ],
        "latlng": [
            46,
            25
        ],
        "name": "Romania",
        "country_code": "RO",
        "capital": "Bucharest"
    },
    {
        "timezones": [
            "Europe/Kaliningrad",
            "Europe/Moscow",
            "Europe/Simferopol",
            "Europe/Volgograd",
            "Europe/Kirov",
            "Europe/Astrakhan",
            "Europe/Samara",
            "Europe/Ulyanovsk",
            "Asia/Yekaterinburg",
            "Asia/Omsk",
            "Asia/Novosibirsk",
            "Asia/Barnaul",
            "Asia/Tomsk",
            "Asia/Novokuznetsk",
            "Asia/Krasnoyarsk",
            "Asia/Irkutsk",
            "Asia/Chita",
            "Asia/Yakutsk",
            "Asia/Khandyga",
            "Asia/Vladivostok",
            "Asia/Ust-Nera",
            "Asia/Magadan",
            "Asia/Sakhalin",
            "Asia/Srednekolymsk",
            "Asia/Kamchatka",
            "Asia/Anadyr"
        ],
        "latlng": [
            60,
            100
        ],
        "name": "Russia",
        "country_code": "RU",
        "capital": "Moscow"
    },
    {
        "timezones": [
            "Africa/Kigali"
        ],
        "latlng": [
            -2,
            30
        ],
        "name": "Rwanda",
        "country_code": "RW",
        "capital": "Kigali"
    },
    {
        "timezones": [
            "Asia/Riyadh"
        ],
        "latlng": [
            25,
            45
        ],
        "name": "Saudi Arabia",
        "country_code": "SA",
        "capital": "Riyadh"
    },
    {
        "timezones": [
            "Africa/Khartoum"
        ],
        "latlng": [
            15,
            30
        ],
        "name": "Sudan",
        "country_code": "SD",
        "capital": "Khartoum"
    },
    {
        "timezones": [
            "Africa/Dakar"
        ],
        "latlng": [
            14,
            -14
        ],
        "name": "Senegal",
        "country_code": "SN",
        "capital": "Dakar"
    },
    {
        "timezones": [
            "Asia/Singapore"
        ],
        "latlng": [
            1.36666666,
            103.8
        ],
        "name": "Singapore",
        "country_code": "SG",
        "capital": "Singapore"
    },
    {
        "timezones": [
            "Atlantic/South_Georgia"
        ],
        "latlng": [
            -54.5,
            -37
        ],
        "name": "South Georgia",
        "country_code": "GS",
        "capital": "King Edward Point"
    },
    {
        "timezones": [
            "Arctic/Longyearbyen"
        ],
        "latlng": [
            78,
            20
        ],
        "name": "Svalbard and Jan Mayen",
        "country_code": "SJ",
        "capital": "Longyearbyen"
    },
    {
        "timezones": [
            "Pacific/Guadalcanal"
        ],
        "latlng": [
            -8,
            159
        ],
        "name": "Solomon Islands",
        "country_code": "SB",
        "capital": "Honiara"
    },
    {
        "timezones": [
            "Africa/Freetown"
        ],
        "latlng": [
            8.5,
            -11.5
        ],
        "name": "Sierra Leone",
        "country_code": "SL",
        "capital": "Freetown"
    },
    {
        "timezones": [
            "America/El_Salvador"
        ],
        "latlng": [
            13.83333333,
            -88.91666666
        ],
        "name": "El Salvador",
        "country_code": "SV",
        "capital": "San Salvador"
    },
    {
        "timezones": [
            "Europe/San_Marino"
        ],
        "latlng": [
            43.76666666,
            12.41666666
        ],
        "name": "San Marino",
        "country_code": "SM",
        "capital": "City of San Marino"
    },
    {
        "timezones": [
            "Africa/Mogadishu"
        ],
        "latlng": [
            10,
            49
        ],
        "name": "Somalia",
        "country_code": "SO",
        "capital": "Mogadishu"
    },
    {
        "timezones": [
            "America/Miquelon"
        ],
        "latlng": [
            46.83333333,
            -56.33333333
        ],
        "name": "Saint Pierre and Miquelon",
        "country_code": "PM",
        "capital": "Saint-Pierre"
    },
    {
        "timezones": [
            "Europe/Belgrade"
        ],
        "latlng": [
            44,
            21
        ],
        "name": "Serbia",
        "country_code": "RS",
        "capital": "Belgrade"
    },
    {
        "timezones": [
            "Africa/Juba"
        ],
        "latlng": [
            7,
            30
        ],
        "name": "South Sudan",
        "country_code": "SS",
        "capital": "Juba"
    },
    {
        "timezones": [
            "Africa/Sao_Tome"
        ],
        "latlng": [
            1,
            7
        ],
        "name": "S\u00e3o Tom\u00e9 and Pr\u00edncipe",
        "country_code": "ST",
        "capital": "S\u00e3o Tom\u00e9"
    },
    {
        "timezones": [
            "America/Paramaribo"
        ],
        "latlng": [
            4,
            -56
        ],
        "name": "Suriname",
        "country_code": "SR",
        "capital": "Paramaribo"
    },
    {
        "timezones": [
            "Europe/Bratislava"
        ],
        "latlng": [
            48.66666666,
            19.5
        ],
        "name": "Slovakia",
        "country_code": "SK",
        "capital": "Bratislava"
    },
    {
        "timezones": [
            "Europe/Ljubljana"
        ],
        "latlng": [
            46.11666666,
            14.81666666
        ],
        "name": "Slovenia",
        "country_code": "SI",
        "capital": "Ljubljana"
    },
    {
        "timezones": [
            "Europe/Stockholm"
        ],
        "latlng": [
            62,
            15
        ],
        "name": "Sweden",
        "country_code": "SE",
        "capital": "Stockholm"
    },
    {
        "timezones": [
            "Africa/Mbabane"
        ],
        "latlng": [
            -26.5,
            31.5
        ],
        "name": "Swaziland",
        "country_code": "SZ",
        "capital": "Lobamba"
    },
    {
        "timezones": [
            "America/Lower_Princes"
        ],
        "latlng": [
            18.033333,
            -63.05
        ],
        "name": "Sint Maarten",
        "country_code": "SX",
        "capital": "Philipsburg"
    },
    {
        "timezones": [
            "Indian/Mahe"
        ],
        "latlng": [
            -4.58333333,
            55.66666666
        ],
        "name": "Seychelles",
        "country_code": "SC",
        "capital": "Victoria"
    },
    {
        "timezones": [
            "Asia/Damascus"
        ],
        "latlng": [
            35,
            38
        ],
        "name": "Syria",
        "country_code": "SY",
        "capital": "Damascus"
    },
    {
        "timezones": [
            "America/Grand_Turk"
        ],
        "latlng": [
            21.75,
            -71.58333333
        ],
        "name": "Turks and Caicos Islands",
        "country_code": "TC",
        "capital": "Cockburn Town"
    },
    {
        "timezones": [
            "Africa/Ndjamena"
        ],
        "latlng": [
            15,
            19
        ],
        "name": "Chad",
        "country_code": "TD",
        "capital": "N'Djamena"
    },
    {
        "timezones": [
            "Africa/Lome"
        ],
        "latlng": [
            8,
            1.16666666
        ],
        "name": "Togo",
        "country_code": "TG",
        "capital": "Lom\u00e9"
    },
    {
        "timezones": [
            "Asia/Bangkok"
        ],
        "latlng": [
            15,
            100
        ],
        "name": "Thailand",
        "country_code": "TH",
        "capital": "Bangkok"
    },
    {
        "timezones": [
            "Asia/Dushanbe"
        ],
        "latlng": [
            39,
            71
        ],
        "name": "Tajikistan",
        "country_code": "TJ",
        "capital": "Dushanbe"
    },
    {
        "timezones": [
            "Pacific/Fakaofo"
        ],
        "latlng": [
            -9,
            -172
        ],
        "name": "Tokelau",
        "country_code": "TK",
        "capital": "Fakaofo"
    },
    {
        "timezones": [
            "Asia/Ashgabat"
        ],
        "latlng": [
            40,
            60
        ],
        "name": "Turkmenistan",
        "country_code": "TM",
        "capital": "Ashgabat"
    },
    {
        "timezones": [
            "Asia/Dili"
        ],
        "latlng": [
            -8.83333333,
            125.91666666
        ],
        "name": "Timor-Leste",
        "country_code": "TL",
        "capital": "Dili"
    },
    {
        "timezones": [
            "Pacific/Tongatapu"
        ],
        "latlng": [
            -20,
            -175
        ],
        "name": "Tonga",
        "country_code": "TO",
        "capital": "Nuku'alofa"
    },
    {
        "timezones": [
            "America/Port_of_Spain"
        ],
        "latlng": [
            11,
            -61
        ],
        "name": "Trinidad and Tobago",
        "country_code": "TT",
        "capital": "Port of Spain"
    },
    {
        "timezones": [
            "Africa/Tunis"
        ],
        "latlng": [
            34,
            9
        ],
        "name": "Tunisia",
        "country_code": "TN",
        "capital": "Tunis"
    },
    {
        "timezones": [
            "Europe/Istanbul"
        ],
        "latlng": [
            39,
            35
        ],
        "name": "Turkey",
        "country_code": "TR",
        "capital": "Ankara"
    },
    {
        "timezones": [
            "Pacific/Funafuti"
        ],
        "latlng": [
            -8,
            178
        ],
        "name": "Tuvalu",
        "country_code": "TV",
        "capital": "Funafuti"
    },
    {
        "timezones": [
            "Asia/Taipei"
        ],
        "latlng": [
            23.5,
            121
        ],
        "name": "Taiwan",
        "country_code": "TW",
        "capital": "Taipei"
    },
    {
        "timezones": [
            "Africa/Dar_es_Salaam"
        ],
        "latlng": [
            -6,
            35
        ],
        "name": "Tanzania",
        "country_code": "TZ",
        "capital": "Dodoma"
    },
    {
        "timezones": [
            "Africa/Kampala"
        ],
        "latlng": [
            1,
            32
        ],
        "name": "Uganda",
        "country_code": "UG",
        "capital": "Kampala"
    },
    {
        "timezones": [
            "Europe/Kiev",
            "Europe/Uzhgorod",
            "Europe/Zaporozhye"
        ],
        "latlng": [
            49,
            32
        ],
        "name": "Ukraine",
        "country_code": "UA",
        "capital": "Kiev"
    },
    {
        "timezones": [
            "Pacific/Johnston",
            "Pacific/Midway",
            "Pacific/Wake"
        ],
        "latlng": [
            19.2911437,
            166.618332
        ],
        "name": "United States Minor Outlying Islands",
        "country_code": "UM",
        "capital": null
    },
    {
        "timezones": [
            "America/Montevideo"
        ],
        "latlng": [
            -33,
            -56
        ],
        "name": "Uruguay",
        "country_code": "UY",
        "capital": "Montevideo"
    },
    {
        "timezones": [
            "America/New_York",
            "America/Detroit",
            "America/Kentucky/Louisville",
            "America/Kentucky/Monticello",
            "America/Indiana/Indianapolis",
            "America/Indiana/Vincennes",
            "America/Indiana/Winamac",
            "America/Indiana/Marengo",
            "America/Indiana/Petersburg",
            "America/Indiana/Vevay",
            "America/Chicago",
            "America/Indiana/Tell_City",
            "America/Indiana/Knox",
            "America/Menominee",
            "America/North_Dakota/Center",
            "America/North_Dakota/New_Salem",
            "America/North_Dakota/Beulah",
            "America/Denver",
            "America/Boise",
            "America/Phoenix",
            "America/Los_Angeles",
            "America/Anchorage",
            "America/Juneau",
            "America/Sitka",
            "America/Metlakatla",
            "America/Yakutat",
            "America/Nome",
            "America/Adak",
            "Pacific/Honolulu"
        ],
        "latlng": [
            38,
            -97
        ],
        "name": "United States",
        "country_code": "US",
        "capital": "Washington D.C."
    },
    {
        "timezones": [
            "Asia/Samarkand",
            "Asia/Tashkent"
        ],
        "latlng": [
            41,
            64
        ],
        "name": "Uzbekistan",
        "country_code": "UZ",
        "capital": "Tashkent"
    },
    {
        "timezones": [
            "Europe/Vatican"
        ],
        "latlng": [
            41.9,
            12.45
        ],
        "name": "Vatican City",
        "country_code": "VA",
        "capital": "Vatican City"
    },
    {
        "timezones": [
            "America/St_Vincent"
        ],
        "latlng": [
            13.25,
            -61.2
        ],
        "name": "Saint Vincent and the Grenadines",
        "country_code": "VC",
        "capital": "Kingstown"
    },
    {
        "timezones": [
            "America/Caracas"
        ],
        "latlng": [
            8,
            -66
        ],
        "name": "Venezuela",
        "country_code": "VE",
        "capital": "Caracas"
    },
    {
        "timezones": [
            "America/Tortola"
        ],
        "latlng": [
            18.431383,
            -64.62305
        ],
        "name": "British Virgin Islands",
        "country_code": "VG",
        "capital": "Road Town"
    },
    {
        "timezones": [
            "America/St_Thomas"
        ],
        "latlng": [
            18.35,
            -64.933333
        ],
        "name": "United States Virgin Islands",
        "country_code": "VI",
        "capital": "Charlotte Amalie"
    },
    {
        "timezones": [
            "Asia/Ho_Chi_Minh"
        ],
        "latlng": [
            16.16666666,
            107.83333333
        ],
        "name": "Vietnam",
        "country_code": "VN",
        "capital": "Hanoi"
    },
    {
        "timezones": [
            "Pacific/Efate"
        ],
        "latlng": [
            -16,
            167
        ],
        "name": "Vanuatu",
        "country_code": "VU",
        "capital": "Port Vila"
    },
    {
        "timezones": [
            "Pacific/Wallis"
        ],
        "latlng": [
            -13.3,
            -176.2
        ],
        "name": "Wallis and Futuna",
        "country_code": "WF",
        "capital": "Mata-Utu"
    },
    {
        "timezones": [
            "Pacific/Apia"
        ],
        "latlng": [
            -13.58333333,
            -172.33333333
        ],
        "name": "Samoa",
        "country_code": "WS",
        "capital": "Apia"
    },
    {
        "timezones": [
            "Asia/Aden"
        ],
        "latlng": [
            15,
            48
        ],
        "name": "Yemen",
        "country_code": "YE",
        "capital": "Sana'a"
    },
    {
        "timezones": [
            "Africa/Johannesburg"
        ],
        "latlng": [
            -29,
            24
        ],
        "name": "South Africa",
        "country_code": "ZA",
        "capital": "Pretoria"
    },
    {
        "timezones": [
            "Africa/Lusaka"
        ],
        "latlng": [
            -15,
            30
        ],
        "name": "Zambia",
        "country_code": "ZM",
        "capital": "Lusaka"
    },
    {
        "timezones": [
            "Africa/Harare"
        ],
        "latlng": [
            -20,
            30
        ],
        "name": "Zimbabwe",
        "country_code": "ZW",
        "capital": "Harare"
    }
]

function convertJson() {
    const timezoneCountryMap = tzMap.reduce((acc, country) => {
        country.timezones.forEach((timezone) => {
            acc[timezone] = country.country_code;
        });
        return acc;
    }, {});
    console.log('start-------------------------------------');
    console.log(JSON.stringify(timezoneCountryMap, null, 2));
    console.log('end-------------------------------------');
}
// convertJson();


// to store the every url in the DB

function captureURLonEveryPageRender() {
    const apiUrl = `https://api.mastersunion.org/api/leads/captureClicks`;
    const pageUrl = window.location.href; // Get the full URL of the current web page

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: pageUrl })
    })
        .then(response => response.json())
        .then(data => console.log("Success of url save in db:", data))
        .catch(error => console.error("Error:", error));
}

// Call the function whenever needed
captureURLonEveryPageRender();




// textarea word limit


  