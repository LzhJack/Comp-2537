function redirect_to_signup() {
    location.href = "/signUp"
}

function show_full_menu() {
    console.log($("#full_menu").css("display"))
    if ($("#full_menu").css("display") == "none") {
        $("#full_menu").css("display", "flex")
    }
    else {
        $("#full_menu").css("display", "none")
    }
}

function redirect_to_page() {
    if ($(this).attr("id") == "login") {
        location.href = "/poke"
    }
}

// This code snippet was a portion the W3Schools Horizontal Tabs How-To
// Adds a class (the class is defined the index.css under the navbar section) 
// that will change the background colour to give the effect of showing the current tab.
// You can find it here: https://www.w3schools.com/howto/howto_js_tabs.asp
function show_active_nav_item() {
    // Removes the class from all navbar items
    $(".navbar-item").removeClass("active")
    // Adds the class to the recently clicked navbar item
    $(this).addClass("active")
}
//

function return_to_normal_position() {
    // Reset the y-position and box-shadow values back to their default
    $(".news-card").css({"transform": "translate(0, 0)", "box-shadow": "0px 4px 4px rgb(0, 0, 0, 0.25)"})
}

function show_click_effect() {
    // Adapted from a W3Schools How-To on how to simulate button pressed effect.
    // Since the click effect is happening on a div element and not a button, the action was
    // done through JS instead.
    // You can find it here: https://www.w3schools.com/howto/howto_css_animate_buttons.asp
    // Once a news article card is clicked, move the card down 2px and reduce the box-shadow effect
    $(this).css({"transform": "translate(0, 2px)", "box-shadow": "0px 2px 0px rgb(0, 0, 0, 0.25)"})
    // Call the callback, 'return_to_normal_position' after 150ms
    setTimeout(return_to_normal_position, 150)
}

function sign_out_confirmation(data) {
    console.log(data)
    location.href = "/login"
}

function sign_out_user() {
    $.ajax(
        {
            "url": "/signOut",
            "type": "GET",
            "success": sign_out_confirmation
        }
    )
}

function process_response(data) {
    console.log(data)
    if (data == "success") {
        location.href = "/poke"
    } else if (data == "admin detected") {
        location.href = "/adminPanel"
    } else {
        $("#incorrect-login").text(data)
    }
}

function change_display_name(data) {
    console.log(data)
    $(".logged_in_username").text(data[0].name)
}

function welcome_the_user() {
    $.ajax(
        {
            "url": "/getUserInfo",
            "type": "GET",
            "success": change_display_name
        }
    )
}

function setup() {
    welcome_the_user()
    $("#sign_out").click(sign_out_user)
    console.log("loaded")
    $("body").on("click", ".news-card", show_click_effect)
    $(".navbar-item").click(redirect_to_page)
    $(".button-item").click(redirect_to_page)
    $("body").on("click", ".navbar-item", show_active_nav_item)
    $(".profile-icon").click(show_full_menu)
    $("#login").click(function() {
        $.ajax({
            type: "POST",
            url: "/login",
            data: {
                username: $("#username").val(),
                password: $("#password").val()
            },
            success: process_response
        })
    })
    $("#sign").click(redirect_to_signup)
}

$("#full_menu").hide()
$(document).ready(setup)