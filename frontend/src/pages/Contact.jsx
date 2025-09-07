import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone',
      details: ['+92-22-2765870', '+92-22-2765871'],
      subtitle: 'Call us during office hours'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      details: ['info@sau.edu.pk', 'admissions@sau.edu.pk'],
      subtitle: 'Send us your questions'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Address',
      details: ['Tandojam, Hyderabad', 'Sindh 70060, Pakistan'],
      subtitle: 'Visit our campus'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Office Hours',
      details: ['Mon - Fri: 8:00 AM - 4:00 PM', 'Saturday: 8:00 AM - 2:00 PM'],
      subtitle: 'We\'re here to help'
    }
  ];

  const departments = [
    {
      name: 'Admissions Office',
      email: 'admissions@sau.edu.pk',
      phone: '+92-22-2765872',
      description: 'For admission inquiries and application support'
    },
    {
      name: 'Academic Affairs',
      email: 'academic@sau.edu.pk',
      phone: '+92-22-2765873',
      description: 'For academic programs and curriculum information'
    },
    {
      name: 'Student Services',
      email: 'students@sau.edu.pk',
      phone: '+92-22-2765874',
      description: 'For student support and campus services'
    },
    {
      name: 'Research Office',
      email: 'research@sau.edu.pk',
      phone: '+92-22-2765875',
      description: 'For research opportunities and collaborations'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-green-100 leading-relaxed">
              Get in touch with Sindh Agriculture University. We're here to help 
              with your questions about admissions, programs, and campus life.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to reach us for any questions or assistance you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="card text-center">
                <div className="text-green-600 flex justify-center mb-4">
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {info.title}
                </h3>
                <div className="space-y-1 mb-3">
                  {info.details.map((detail, idx) => (
                    <div key={idx} className="text-gray-600">
                      {detail}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  {info.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Departments */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-600 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">
                          <User className="inline w-4 h-4 mr-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Your full name"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email" className="form-label">
                          <Mail className="inline w-4 h-4 mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject" className="form-label">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="form-input"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="admissions">Admissions Inquiry</option>
                        <option value="academics">Academic Programs</option>
                        <option value="campus">Campus Information</option>
                        <option value="technical">Technical Support</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message" className="form-label">
                        <MessageSquare className="inline w-4 h-4 mr-2" />
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="6"
                        className="form-input resize-none"
                        placeholder="Write your message here..."
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full text-lg py-3"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Send className="w-5 h-5" />
                          Send Message
                        </div>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Department Contacts */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Department Contacts</h2>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {dept.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {dept.description}
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${dept.email}`} className="hover:text-green-600 transition-colors">
                          {dept.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${dept.phone}`} className="hover:text-green-600 transition-colors">
                          {dept.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Campus Map Placeholder */}
              <div className="card mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Find Us</h3>
                <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Campus Map</p>
                    <p className="text-xs">Interactive map coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick answers to common questions about SAU and our virtual campus tour
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-2">How do I apply for admission?</h3>
                <p className="text-gray-600 text-sm">
                  Visit our official website or contact the Admissions Office for detailed application procedures and requirements.
                </p>
              </div>
              
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-2">Can I visit the campus physically?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! While our virtual tour provides comprehensive coverage, physical visits are welcome during office hours.
                </p>
              </div>
              
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-2">What programs do you offer?</h3>
                <p className="text-gray-600 text-sm">
                  We offer undergraduate and graduate programs in agriculture, engineering, computer science, and related fields.
                </p>
              </div>
              
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-2">How accurate is the virtual tour?</h3>
                <p className="text-gray-600 text-sm">
                  Our virtual tour is updated regularly and provides accurate, current representations of our campus facilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;