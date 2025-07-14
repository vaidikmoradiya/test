import React from 'react';

const servicesData = [
  {
    id: 1,
    title: "Lorem ipsum dummy",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    number: "01",
    type: "text",
    order: { md: 1, default: 1 }
  },
  {
    id: 2,
    type: "image",
    image: require('../../assets/Explore1.png'),
    order: { md: 2, default: 2 }
  },
  {
    id: 3,
    title: "Lorem ipsum",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    number: "03",
    type: "text",
    order: { md: 3, default: 5 }
  },
  {
    id: 4,
    type: "image",
    image: require('../../assets/Explore2.png'),
    hasButton: true,
    order: { md: 4, default: 0 }
  },
  {
    id: 5,
    title: "Lorem ipsum",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    number: "02",
    type: "text",
    order: { md: 5, default: 3 }
  },
  {
    id: 6,
    type: "image",
    image: require('../../assets/Explore3.png'),
    order: { md: 6, default: 4 }
  }
];

const ExploreOurServices = () => {
  return (
    <section className="mv_services_section">
      <div className="m_container">
        <h5 className="mv_section_subtitle text-center mb-2">Our Service</h5>
        <h2 className="mv_relay_text text-center">Explore Our Services</h2>

        <div className="mv_services_grid">
          {servicesData.map((service) => (
            <div 
              key={service.id}
              className={`mv_service_item ${service.type === 'image' ? 'mv_image_item' : ''} ${service.hasButton ? 'mv_with_button' : ''} order-md-${service.order.md} order-${service.order.default}`}
            >
              {service.type === 'text' ? (
                <div className="mv_service_content">
                  <h3 className="mv_service_title">{service.title}</h3>
                  <p className="mv_service_text" dangerouslySetInnerHTML={{ __html: service.description }} />
                  <span className="mv_service_number">{service.number}</span>
                </div>
              ) : (
                <>
                  <img src={service.image} alt="Service related image" className="service-image" />
                  {service.hasButton && (
                    <button className="mv_explore_button">Explore More</button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreOurServices;
