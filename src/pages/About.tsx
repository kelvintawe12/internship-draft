import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-5xl font-extrabold mb-8 text-indigo-700">About Mount Meru SoyCo Rwanda</h1>
      <p className="mb-10 text-lg text-gray-700 leading-relaxed">
        Mount Meru SoyCo Rwanda is dedicated to providing high-quality soybean products while promoting sustainable agriculture and community development. Our mission is to support local farmers and deliver nutritious, affordable products to our customers.
      </p>
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-4 text-indigo-800">Our History</h2>
        <p className="text-gray-700 leading-relaxed">
          Founded in 2010, Mount Meru SoyCo has grown from a small cooperative into a leading soybean processor in Rwanda. We have continuously invested in modern technology and sustainable farming practices to ensure the best quality products.
        </p>
      </section>
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-4 text-indigo-800">Our Values</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Quality and Excellence</li>
          <li>Sustainability and Environmental Stewardship</li>
          <li>Community Empowerment</li>
          <li>Innovation and Continuous Improvement</li>
          <li>Customer Satisfaction</li>
        </ul>
      </section>
      <section>
        <h2 className="text-3xl font-bold mb-4 text-indigo-800">Meet Our Team</h2>
        <p className="text-gray-700 leading-relaxed">
          Our team consists of experienced professionals passionate about agriculture, food processing, and community development. We work together to ensure that every product meets our high standards.
        </p>
      </section>
    </div>
  );
};

export default About;
