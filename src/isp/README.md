### announcements API
```js
fetch("/api/isp/announcements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        user: "user",
        pass: "password"
    }),
}).then((res) => res.json()).then((announcements) => {
    //some code
});
```
### example data returned
```json
[
    {
        "text": "announcement text",
        "additionalDetails": "details",          //can be null
        "createdBy": "some person",
        "date": "some date as a string NOT UTC",
        "attachedFileLink": "link to attachment" //can be null
    }
]
```





### cip API
```js
fetch("/api/isp/cip", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        user: "user",
        pass: "password"
    }),
}).then((res) => res.json()).then(({ totalCipHours, activities }) => {
    //some code
});
```
### example data returned
```json
{
    "totalCipHours": 3,
    "activities": [
        {
            "activityName": "some name",
            "organisation": "some name",
            "type": "some value",               //Teacher-Initiated or Student-Initiated

            "period": "some date range as string NOT UTC",
            "hours": 3,
            "status": "some value"              //WY's ones are all "Endorsed", could be to show status of acceptance
        }
    ]
}
```





### discipline API
```js
fetch("/api/isp/discipline", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        user: "user",
        pass: "password"
    }),
}).then((res) => res.json()).then(({ totalDemeritPoints, disciplineRecords }) => {
    //some code
});
```
### example data returned
```json
{
    "totalDemeritPoints": 1,
    "disciplineRecords": [
        {
            "category": "Attendance",        //WY's case: Attendance
            "offence": "Late",               //WY's case: Late
            "date": "some date as string e.g. 08/08/2001",
            "demeritPoints": 1,
            "majorOffence": false
        }
    ]
}
```





### events API
```js
fetch("/api/isp/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        user: "user",
        pass: "password"
    }),
}).then((res) => res.json()).then((events) => {
    //some code
});
```
### example data returned
```json
{
    "today": [
        {
            "eventName": "Name",
            "date": "Thursday 27 Jun 2019"
        }
    ], // can be empty array
    "tomorrow": [
        {
            "eventName": "some value",
            "date": "Friday 28 Jun 2019"
        }
    ], // can be empty array
    "next1Week": [
        {
            "eventName": "PW Mid-Term Evaluation",
            "date": "Thursday 04 Jul 2019"
        }
    ] // can be empty array
}
```





### exams API
```js
fetch("/api/isp/exams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        user: "user",
        pass: "password"
    }),
}).then((res) => res.json()).then(({ examResults, reports }) => {
    //some code
});
```
### example data returned
```json
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
```





### getFile API
**link can be from either /announcements or /exams**
```js
// opens new tab, downloads file at link
window.open("/api/isp/get-file?user=**BASE64ENCODEDUSERNAME**&pass=**BASE64ENCODEDPASS**&fileLink=**link**");
//                                                                  ^^^^^^^^^^^^^^^^^^^^^^^^^      ^^^^^^^^^^^^^^^^^^^^^          ^^^^^^^^
```

link: https://isphs.hci.edu.sg/getStudentDocument.asp?ID=**ID** //this is for exam reports
or
https://isphs.hci.edu.sg/getfile.asp?ID=**ID** //this is for announcements
### example data returned
opens a new tab and downloads file





### particulars API
```js
fetch("/api/isp/particulars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        user: "user",
        pass: "password"
    }),
}).then((res) => res.json()).then((particulars) => {
    //some code
});
```
### example data returned
```json
{
    "name": "some name",
    "chineseName": "some name",
    "gender": "M or F",
    "photoUrl": "some url for image",
    "dateOfBirth": "some date with dashes",
    "race": "some value in caps",
    "citizenship": "some value in caps",
    "religion": "some value in caps",
    "primarySchool": "some value",
    "psleTScore": "some value, **yes its a string**"
}
```





### projectwork API
```js
fetch("/api/isp/project-work", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        user: "user",
        pass: "password"
    }),
}).then((res) => res.json()).then((projectWork) => {
    //some code
});
```
### example data returned
```json
{
    "name": "some value",
    "category": "some value",
    "mentor": "some name in caps",
    "mentorApprovalStatus": "some value",
    "catManagerApprovalStatus": "some value",
    "projectStatus": "some value"
}
```