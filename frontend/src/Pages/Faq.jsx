import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFaq } from '../Redux-Toolkit/ToolkitSlice/Admin/FaqSlice';

// const faqData = [
//   {
//     topic: 'General Question',
//     questions: [
//       {
//         q: 'What is embroidery machine, and how does it works?',
//         a: 'An embroidery machine is a device used to create patterns on textiles. It works by following a digital design and stitching it onto fabric using threads.'
//       },
//       {
//         q: 'Do you provide training or tutorials on how to use the machines?',
//         a: 'Yes, we offer comprehensive training and tutorials for all our embroidery machines, both online and in-person.'
//       },
//       {
//         q: 'What is the difference between domestic and commercial embroidery machines?',
//         a: 'Domestic machines are designed for home use and smaller projects, while commercial machines are built for high-volume, professional embroidery work.'
//       },
//       {
//         q: 'What should I do if my machine is not working properly?',
//         a: 'If your machine is not working properly, please refer to the troubleshooting section in the manual or contact our support team for assistance.'
//       },
//       {
//         q: 'Can I schedule a demo before purchasing an embroidery machine?',
//         a: 'Absolutely! You can schedule a demo with our team to see the machine in action before making a purchase.'
//       },
//       {
//         q: 'Do you provide business consultation for embroidery startups?',
//         a: 'Yes, we offer business consultation services to help embroidery startups get off the ground and succeed.'
//       }
//     ]
//   },
//   {
//     topic: 'Ordering & Shipping',
//     questions: [
//       {
//         q: 'How do I place an order?',
//         a: 'You can place an order through our website or by contacting our sales team directly.'
//       },
//       {
//         q: 'What are the shipping options?',
//         a: 'We offer standard and express shipping options. Shipping times and costs vary by location.'
//       }
//     ]
//   },
//   {
//     topic: 'Product & Technical Question',
//     questions: [
//       {
//         q: 'What file formats are supported?',
//         a: 'Our machines support a variety of file formats including DST, PES, and more.'
//       }
//     ]
//   },
//   {
//     topic: 'Support & Maintenance',
//     questions: [
//       {
//         q: 'How do I maintain my embroidery machine?',
//         a: 'Regular cleaning and oiling are essential. Refer to the user manual for detailed maintenance instructions.'
//       }
//     ]
//   },
//   {
//     topic: 'Business & Bulk Orders',
//     questions: [
//       {
//         q: 'Do you offer discounts for bulk orders?',
//         a: 'Yes, we provide special pricing for bulk and business orders. Contact our sales team for details.'
//       }
//     ]
//   },
//   {
//     topic: 'Software & Design',
//     questions: [
//       {
//         q: 'Is design software included?',
//         a: 'Some machines come with design software included. Please check the product details or ask our team.'
//       }
//     ]
//   },
//   {
//     topic: 'Returns & Refunds',
//     questions: [
//       {
//         q: 'What is your return policy?',
//         a: 'We offer a 30-day return policy on most products. Please see our returns page for more information.'
//       }
//     ]
//   }
// ];

const Faq = () => {
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);

  const handleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqData = useSelector((state) => state.faq.allFaq)
  const dispatch = useDispatch()

  // Group FAQs by categoryId._id
  const groupedFaqs = faqData.reduce((acc, faq) => {
    const catId = faq.categoryId?._id;
    const catName = faq.categoryId?.categoryName;
    if (!catId) return acc;
    if (!acc[catId]) {
      acc[catId] = {
        categoryId: catId,
        categoryName: catName,
        faqs: [],
      };
    }
    acc[catId].faqs.push(faq);
    return acc;
  }, {});

  // Convert to array for easier mapping
  const categories = Object.values(groupedFaqs);

//   console.log("faqData", faqData);

  useEffect(() => {
    dispatch(getAllFaq())
  }, [])

  return (
    <section className="mv_faq_section">

        <div className="m_container">
            <div className="text-center">
                <div className="mv_faq_title">Frequently Asked Question</div>
                <div className="mv_faq_subtitle">
                Your Question, Answered! Check out our FAQ Section, we've got all your question answered
                </div>
          </div>
        </div>

        <div className='mv_faq_topic_section'>
            <div className="m_container">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-lg-3">
                        <aside className="mv_faq_sidebar">
                            <div className="mv_faq_sidebar_box">
                                <div className="mv_faq_sidebar_title">FAQ Topics</div>
                                <ul className="mv_faq_topic_list">
                                {categories.map((cat, idx) => (
                                    <li
                                    key={cat.categoryId}
                                    onClick={() => { setSelectedTopic(idx); setOpenIndex(null); }}
                                    className={`mv_faq_topic_item${selectedTopic === idx ? ' active' : ''}`}
                                    >
                                    {cat.categoryName}
                                    {selectedTopic === idx && <span className="mv_faq_topic_arrow">→</span>}
                                    </li>
                                ))}
                                </ul>
                            </div>
                        </aside>
                    </div>
                    {/* Main FAQ Content */}
                    <div className="col-lg-9">
                        <div className="mv_faq_main_content">
                        <div className="mv_faq_accordion">
                                {categories[selectedTopic]?.faqs.map((item, idx) => (
                                <div
                                    key={item._id}
                                    className="mv_faq_accordion_item"
                                >
                                    <button
                                    onClick={() => handleAccordion(idx)}
                                    className="mv_faq_accordion_btn"
                                    >
                                    {item.faqQuestion}
                                    <span
                                        className={`mv_faq_accordion_arrow ${openIndex === idx ? 'open' : 'closed'}`}
                                    >
                                        &#8250;
                                    </span>
                                    </button>
                                    {openIndex === idx && (
                                    <div className="mv_faq_accordion_answer">
                                        {item.faqAnswer}
                                    </div>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Faq;
