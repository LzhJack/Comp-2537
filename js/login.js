function redirect_to_signup() {
    location.href = "/signup"
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
    if ($(this).attr("id") == "home-tab") {
        location.href = "/poke"
    }
}

function show_active_nav_item() {
    $(".navbar-item").removeClass("active")
    $(this).addClass("active")
}
//

function return_to_normal_position() {
    $(".news-card").css({"transform": "translate(0, 0)", "box-shadow": "0px 4px 4px rgb(0, 0, 0, 0.25)"})
}

function show_click_effect() {
    $(this).css({"transform": "translate(0, 2px)", "box-shadow": "0px 2px 0px rgb(0, 0, 0, 0.25)"})
    setTimeout(return_to_normal_position, 150)
}

function sign_out_confirmation(data) {
    console.log(data)
    location.href = "/poke"
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

function hide_error_message() {
    $("#incorrect-login").hide()
}

function process_response(data) {
    $("#incorrect-login").hide()
    console.log(data)
    if (data != "incorrect information") {
        location.href = "/poke"
    } else {
        $("#incorrect-login").show()
        setTimeout(hide_error_message, 3000)
    }
}

function change_display_name(data) {
    console.log(data)
    $(".logged_in_username").text(data[0].name)
}

// function welcome_the_user() {
//     $.ajax(
//         {
//             "url": "/getUserInfo",
//             "type": "GET",
//             "success": change_display_name
//         }
//     )
// }

function listenToClick() {
    // welcome_the_user()
    $("#sign_out").click(sign_out_user)
    $("#incorrect-login").hide()
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
                name: $("#username").val(),
                password: $("#password").val()
            },
            success: process_response
        })
    })
    $("#sign").click(redirect_to_signup)

}

$("#full_menu").hide()
$(document).ready(listenToClick)