### NOTE!
some_value is used to represent a number
### announcements API
fetch("https://powerclass.herokuapp.com/api/isp/announcement", {
    method: "POST",
    headers: {"Content-Type": "application/json},
    body: JSON.stringify({
        user: "user",
        pass: "password"
    }),
}).then((res) => res.json()).then((announcements) => {
    //some code
});
### returns
[
    {
        "text": "some value",
        "additionalDetails": "some value",          //can be null
        "createdBy": "some person",
        "date": "some date as a string NOT UTC"
        "attachedFileLink": "some value             //can be null
    }
]
### cip API
fetch("https://powerclass.herokuapp.com/api/isp/cip", {
    method: "POST",
    headers: {"Content-Type": "application/json},
    body: JSON.stringify({
        user: "user",
        pass: "password"
    }),
}).then((res) => res.json()).then(({totalCipHours, activities}) => {
    //some code
});
### returns
{
    "totalCipHours": some_value,
    "activities": [
        {
            "activityName": "some name",
            "organisation": "some name",
            "type": "some value"                //Teacher-Initiated or Student-Initiated
            "
            "period": "some date as string NOT UTC",
            "hours": some_value,
            "status": "some value"              //WY's ones are all "Endorsed", could be to show status of acceptance
        }
    ]
}
### discipline API
fetch("https://powerclass.herokuapp.com/api/isp/discipline", {
    method: "POST",
    headers: {"Content-Type": "application/json},
    body: JSON.stringify({
        user: "user",
        pass: "password"
    }),
}).then((res) => res.json()).then(({totalDemeritPoints, disciplineRecords}) => {
    //some code
});
### returns
{
    "totalDemeritPoints": some_value,
    "DisciplineRecords": [
        {
            "category": "some value",        //WY's case: Attendance
            "offence": "some value",         //WY's case: Late
            "date": "some date as string e.g. 08/08/2001",
            "demeritPoints": some_value,
            "majorOffence": some_boolean
        }
    ]
}
### events API
fetch("https://powerclass.herokuapp.com/api/isp/events", {
    method: "POST",
    headers: {"Content-Type": "application/json},
    body: JSON.stringify({
        user: "user",
        pass: "password"
    }),
}).then((res) => res.json()).then((events) => {
    //some code
});
### returns
{
    "today": [
        {
            "eventName": "some value",
            "date": "some date as string **not too sure in what format**"
        }
    ], **can be empty**
    "tomorrow": [
        {
            "eventName": "some value",
            "date": "some date as string **not too sure in what format**"
        }
    ], **can be empty**
    "nextWeek": [
        {
            "eventName": "some value",
            "date": "some date as string **not too sure in what format**"
        }
    ] **can be empty**
}
### exams API
fetch("https://powerclass.herokuapp.com/api/isp/exams", {
    method: "POST",
    headers: {"Content-Type": "application/json},
    body: JSON.stringify({
        user: "user",
        pass: "password"
    }),
}).then((res) => res.json()).then(({examResults, reports}) => {
    //some code
});
### returns
{
    "examResults": [
        {
            "exam": "some value",
            "results": [
                {
                    "subject": "some value in caps",
                    "mark": "some value, **yes its in a string**"
                }
            ]
        }
    ],
    "reports": [
        {
            "reportName": "some report name",
            "reportUrl": "some url to download the file"
        }
    ]
}
### getFile API
**link can be from either /announcements or /exams**
window.open("https://powerclass.herokuapp.com/api/isp/get-file?user=**BASE64ENCODEDUSERNAME**&pass=**BASE64ENCODEDPASS**&fileLink=**link**");

link: https://isphs.hci.edu.sg/getStudentDocument.asp?ID=**ID** //this is for exam reports
or
https://isphs.hci.edu.sg/getfile.asp?ID=**ID** //this is for announcements
### returns
opens a new tab and downloads file
### particulars API
fetch("https://powerclass.herokuapp.com/api/isp/particulars", {
    method: "POST",
    headers: {"Content-Type": "application/json},
    body: JSON.stringify({
        user: "user",
        pass: "password"
    }),
}).then((res) => res.json()).then((particulars) => {
    //some code
});
### returns
{
    "name": "some name",
    "chineseName": "some name",
    "gender": "M or F",
    "photoUrl": "some url for image",
    "dateOfBirth": "some date with dashes",
    "race": "some value in caps",
    "citizenship": "some value in caps",
    "religion": 'some value in caps",
    "primarySchool": "some value",
    "psleTScore": "some value, **yes its a string**"
}
### projectwork API
fetch("https://powerclass.herokuapp.com/api/isp/project-work", {
    method: "POST",
    headers: {"Content-Type": "application/json},
    body: JSON.stringify({
        user: "user",
        pass: "password"
    }),
}).then((res) => res.json()).then((projectWork) => {
    //some code
});
### returns
{
    "name": "some value",
    "category": "some value",
    "mentor": "some name in caps",
    "mentorApprovalStatus": "some value",
    "catManagerApprovalStatus": "some value",
    "projectStatus": "some value"
}