function processResponse(message) {
    console.log(message)
    if (message == "success") {
        location.href = "/thanks"
    }
    else {
        message = message.split(" ")
        if (message.includes("pattern:")) {
            $("#incorrect-signup").text("Please enter a phone number with proper format: XXX-XXX-XXXX.")
        }
        else {
            $("#incorrect-signup").text(message.join(" "))
        }
    }
}

function addAccount() {
    if ($("#username").val().toLowerCase() != "covid") {
        $.ajax({
            type: 'PUT',
            url: '/addNewUser',
            data: {
                name: `${$("#first_name").val()} ${$("#last_name").val()}`,
                email: $("#email").val(),
                username: $("#username").val(),
                password: $("#password").val()
            },
            success: processResponse
        })
    }
    else {
        $("#incorrect-signup").text("covid is and invalid username.")
    }
}

function setup() {
    $("a").click(addAccount)
}

$(document).ready(setup)
