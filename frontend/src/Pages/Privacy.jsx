import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllPrivacyPolicy } from '../Redux-Toolkit/ToolkitSlice/Admin/PrivacyPolicySlice';

const privacy = [
  {
    id: 1,
    title: "General Information",
    content: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    ],
    listItems: []
  },
  {
    id: 2,
    title: "Our Privacy",
    content: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    ],
    listItems: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim"
    ]
  },
  {
    id: 3,
    title: "How long do we keep your personal information?",
    content: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    ],
    listItems: []
  },
  {
    id: 4,
    title: "How we use your information?",
    content: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    ],
    listItems: []
  },
  {
    id: 5,
    title: "Our Privacy",
    content: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    ],
    listItems: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna"
    ]
  }
];

const Privacy = () => {

  const privacyData = useSelector((state) => state.privacyPolicy.allPrivacyPolicy)
  const dispatch = useDispatch()

  // console.log("privacyData", privacyData);

  useEffect(() => {
    dispatch(getAllPrivacyPolicy())
  }, [])

  return (
    <>
      <section className="mv_privacy_section">
        <div className="m_container">
          <div className="text-center">
            <div className="mv_privacy_title">Privacy Policy</div>
            <div className="mv_privacy_subtitle">
              Lorem Ipsum is simply dummy text of the printing and typesetting
            </div>
          </div>
        </div>

        <div className="mv_information_padd">
          <div className="m_container">
            {privacyData?.map((item, index) => (
              <div key={index} className="mv_information_main">
                <p className="mv_information_heading">{item.title}</p>
                {Array.isArray(item.description) ? (
                  item.description.map((text, index) => (
                    <p key={index} className="mv_information_text">{text}</p>
                  ))
                ) : (
                  <p className="mv_information_text">{item.description}</p>
                )}
                {item?.listItems?.length > 0 && (
                  <ul className='mv_information_ul'>
                    {item.listItems.map((listItem, index) => (
                      <li key={index}>{listItem}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

      </section>
    </>
  )
}

export default Privacy