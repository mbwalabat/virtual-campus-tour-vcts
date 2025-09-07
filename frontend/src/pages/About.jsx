import { Award, Users, BookOpen, Leaf, Calendar, MapPin } from 'lucide-react';

const About = () => {
  const milestones = [
    {
      year: '1977',
      title: 'University Established',
      description: 'Sindh Agriculture University was founded to advance agricultural education and research in Pakistan.'
    },
    {
      year: '1980',
      title: 'First Graduation',
      description: 'The first batch of agricultural engineers and scientists graduated from SAU.'
    },
    {
      year: '1995',
      title: 'Research Excellence',
      description: 'Established state-of-the-art research facilities and laboratories for advanced agricultural research.'
    },
    {
      year: '2010',
      title: 'Digital Transformation',
      description: 'Introduced modern computer labs and digital learning resources for students.'
    },
    {
      year: '2024',
      title: 'Virtual Campus Tour',
      description: 'Launched innovative virtual campus tour system to showcase our facilities worldwide.'
    }
  ];

  const achievements = [
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Academic Excellence',
      description: 'Recognized as one of the leading agricultural universities in Pakistan with numerous national and international accolades.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Distinguished Alumni',
      description: 'Our graduates hold key positions in agriculture, research institutions, and government agencies across the world.'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Research Innovation',
      description: 'Published over 1000+ research papers in international journals, contributing to global agricultural knowledge.'
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Sustainable Agriculture',
      description: 'Leading research in sustainable farming practices, climate-resilient crops, and environmental conservation.'
    }
  ];

  const stats = [
    { number: '15,000+', label: 'Students', description: 'Currently enrolled' },
    { number: '500+', label: 'Faculty', description: 'Expert professors & researchers' },
    { number: '40+', label: 'Programs', description: 'Undergraduate & graduate' },
    { number: '47', label: 'Years', description: 'Of educational excellence' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Sindh Agriculture University
            </h1>
            <p className="text-xl md:text-2xl text-green-100 leading-relaxed">
              Pioneering agricultural education, research, and innovation since 1977. 
              Nurturing the next generation of agricultural scientists and engineers 
              to feed the world sustainably.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission & Vision</h2>
              
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-xl font-semibold text-green-600 mb-3">Mission</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To provide quality education, conduct innovative research, and offer 
                    extension services in agriculture and allied fields, contributing to 
                    food security, rural development, and sustainable agricultural practices 
                    in Pakistan and beyond.
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-green-600 mb-3">Vision</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To be a world-class center of excellence in agricultural education, 
                    research, and innovation, producing skilled professionals who will 
                    lead the transformation of agriculture for sustainable development 
                    and global food security.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <img
                src="https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Agricultural Research"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Achievements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Decades of excellence in agricultural education, research, and community service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="card">
                <div className="text-green-600 mb-4">
                  {achievement.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {achievement.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in our 47-year history of educational excellence
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {milestone.year.slice(-2)}
                  </div>
                  {index !== milestones.length - 1 && (
                    <div className="w-px h-16 bg-green-300 mt-4"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-600">{milestone.year}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Visit Our Campus
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Located in the heart of Sindh province, our beautiful campus welcomes students from around the world
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Address</h3>
                  <p className="text-gray-600">
                    Sindh Agriculture University<br />
                    Tandojam, Hyderabad<br />
                    Sindh 70060, Pakistan
                  </p>
                </div>
              </div>

              <div className="card bg-green-50 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Campus Highlights</h4>
                <ul className="text-green-700 space-y-1 text-sm">
                  <li>• 1,000+ acre sprawling campus</li>
                  <li>• State-of-the-art research facilities</li>
                  <li>• Modern hostels and recreational facilities</li>
                  <li>• Extensive agricultural fields and greenhouses</li>
                  <li>• Well-equipped libraries and computer labs</li>
                </ul>
              </div>
            </div>

            <div>
              <img
                src="https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="SAU Campus"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;