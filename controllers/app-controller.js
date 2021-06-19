const fs = require('fs');
const masterData = JSON.parse(fs.readFileSync('masterData.json', 'utf8'));
const masterDataReset = JSON.parse(fs.readFileSync('masterDataReset.json', 'utf8'));

exports.employeeDetails = async (req, res) => {
    res.send({
        "firstname": "Archana",
        "lastname": "Singh",
        "email": "archana.singh0093@gmail.com",
        "age": 0,
        "birthday": "",
        "gender": "Female",
        "location": "",
        "profilepic": "",
        "prevent_data_collection": false,
        "accepted_gdpr": false,
        "goals": [],
        "profileId": "60c9ecafaba1eb6a1af9b3f7"
    })
}

exports.availabileFloors = async (req, res) => {
    let availableFloorList = []

    for (let i = 0; i < masterData.workhalls.length; i++) {
        let ele = masterData.workhalls[i]
        if (ele.is_available) {
            availableFloorList.push({
                "id": i + 1,
                "type": "postback",
                "payload": ele.hall_name + " Hall - Floor " + ele.hall_number,
                "title": ele.hall_name + " Hall - Floor " + ele.hall_number
            })
        }
        if (i == masterData.workhalls.length - 1) {
            if (availableFloorList.length > 0)
                res.send({ "availableFloorList": availableFloorList, "is_available": true })
            else
                res.send({ "availableFloorList": availableFloorList, "is_available": false })
        }
    }
}

exports.bookSeat = async (req, res) => {
    let floor = Number(req.body.floor)
    let seatPreference = req.body.seatPreference
    let seat = ""
    let workhallDetail = masterData.workhalls[floor - 1]
    let seatOptions = Object.keys(workhallDetail.available_seat_numbers)
    if (seatOptions.includes(seatPreference)) {
        if (workhallDetail.available_seat_numbers[seatPreference].length > 0) {
            seat = masterData.workhalls[floor - 1].available_seat_numbers[seatPreference].pop()
            masterData.workhalls[floor - 1].booked_seat_numbers[seatPreference].push(seat)
            seatPreference = "Near " + seatPreference + " area"
        }
        else if (workhallDetail.available_seat_numbers["others"].length > 0) {
            seat = workhallDetail.available_seat_numbers["others"].pop()
            masterData.workhalls[floor - 1].booked_seat_numbers["others"].push(seat)
            masterData.workhalls[floor - 1].temp_length = masterData.workhalls[floor - 1].temp_length - 1
            seatPreference = "Requested seat preference not available"
        }
        else {
            for (let i = 0; i < seatOptions.length; i++) {
                if (workhallDetail.available_seat_numbers[seatOptions[i]].length > 0) {
                    seat = workhallDetail.available_seat_numbers[seatOptions[i]].pop()
                    masterData.workhalls[floor - 1].booked_seat_numbers[seatOptions[i]].push(seat)
                    seatPreference = "Requested seat preference not available. Booked seat is nearby " + seatOptions[i]
                    break;
                }

            }
        }
    }
    else {
        if (workhallDetail.available_seat_numbers["others"].length > 0) {
            seat = workhallDetail.available_seat_numbers["others"].pop()
            masterData.workhalls[floor - 1].booked_seat_numbers["others"].push(seat)
            seatPreference = "Seat preference not given."
        }
        else {
            for (let i = 0; i < seatOptions.length; i++) {
                if (workhallDetail.available_seat_numbers[seatOptions[i]].length > 0) {
                    seat = workhallDetail.available_seat_numbers[seatOptions[i]].pop()
                    masterData.workhalls[floor - 1].booked_seat_numbers[seatOptions[i]].push(seat)
                    seatPreference = "Seat preference not given. Booked seat is nearby " + seatOptions[i]
                    break;
                }

            }
        }
    }
    masterData.workhalls[floor - 1].temp_length = masterData.workhalls[floor - 1].temp_length - 1
    if (masterData.workhalls[floor - 1].temp_length === 0) {
        masterData.workhalls[floor - 1].is_available = false
    }
    fs.writeFileSync("masterData.json", JSON.stringify(masterData));
    res.send(
        [{
            "title": "Hall Detail",
            "subtitle": masterData.workhalls[floor - 1].hall_name + " Hall - Floor " + masterData.workhalls[floor - 1].hall_number,
            "imageUrl": "",
            "defaultActionUrl": "",
            "imageAltText": "",
            "buttons": [
            ]
        },
        {
            "title": "Seat Number",
            "subtitle": seat,
            "imageUrl": "",
            "defaultActionUrl": "",
            "imageAltText": "",
            "buttons": [
            ]
        },
        {
            "title": "Seat Preference",
            "subtitle": seatPreference,
            "imageUrl": "",
            "defaultActionUrl": "",
            "imageAltText": "",
            "buttons": [
            ]

        }]
    )
}

exports.resetMasterData = async (req, res) => {
    fs.writeFileSync("masterData.json", JSON.stringify(masterDataReset));
    res.send("Your data is reset. All seats are available to be booked!")
}