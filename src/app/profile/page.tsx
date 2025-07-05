import {
  Paper,
  ProfileImg,
  PaperHeader,
  VerticalLine,
  HorizontalLine
}
  from '@/components/ui/cv_paper'

export default function CVPage() {
  return (
    <div className="container mx-auto py-8 mt-17">
      <h1 className="text-3xl font-bold text-center">CV Builder</h1>
      <p className="mt-4 text-gray-600 mb-10 text-center">
        Create and manage your professional CV here. This page will be
        implemented with a comprehensive CV builder.
      </p>
      <Paper>
        <PaperHeader>
          <div className="flex items-center space-x-6">
            {/* Ảnh */}
            <ProfileImg>
              <img
                src="https://i.pinimg.com/originals/9b/c9/40/9bc940893848b63365d368e939d63bc1.jpg"
                alt="ronalsi"
                className="w-50 h-50 rounded-full object-cover"
              />
            </ProfileImg>

            {/* Line dọc */}
            <VerticalLine />

            {/* Nội dung */}
            <div className="flex-1 ml-8">
              <div className="mb-5">
                <h1 className="text-6xl font-bold"
                  style={{ fontFamily: 'Elephant, serif' }}>Cris Leo Ronalsi</h1>
                <p className="text-gray-600 text-2xl mx-1">Full-Stack Developer</p>
              </div>

              {/* Phần liên lạc */}
              <div className="flex space-x-6 items-center mx-7 mt-10">
                <div>
                  <span className="text-xl font-bold"
                    style={{ fontFamily: 'Elephant, serif' }}>PHONE</span> <br />
                  <span className="px-1">+1234-567-8909</span>
                </div>
                <VerticalLine className="w-0.5 h-13 bg-black ml-23 mr-10" />
                <div>
                  <span className="text-xl font-bold"
                    style={{ fontFamily: 'Elephant, serif' }}>EMAIL</span> <br />
                  <span className="px-1">abcdxyz1234@domain.com</span>
                </div>
              </div>

              <HorizontalLine className="h-0.5 bg-black m-5 w-135" />

              <div className="flex space-x-6 items-center mx-7">
                <div>
                  <span className="text-xl font-bold"
                    style={{ fontFamily: 'Elephant, serif' }}>WEBSITE</span> <br />
                  <span className="px-1">http://localhost:3000/profile</span>
                </div>
                <VerticalLine className="w-0.5 h-13 bg-black ml-3 mr-10" />
                <div>
                  <span className="text-xl font-bold"
                    style={{ fontFamily: 'Elephant, serif' }}>ADDRESS</span> <br />
                  <span className="px-1">123, ABC Street, Da Nang</span>
                </div>
              </div>
            </div>
          </div>
        </PaperHeader>

        {/* Line ngang */}
        <HorizontalLine />

        {/*Profile Info*/}
        <div className='w-225 h-50 mx-auto mt-7 mb-5'>
          <h1 className='text-4xl font-bold mb-5'
            style={{ fontFamily: 'Elephant, serif' }}>My Profile</h1>
          <p className='text-balance'>
            Hi, I'm Cris Leo Ronalsi, a Full-Stack Developer with a passion for building clean, efficient, and user-focused web applications.
            I specialize in working with technologies like React, Next.js, Node.js, and MongoDB, and enjoy tackling challenges across both front-end and back-end.
            I take pride in writing maintainable code, collaborating effectively with teams, and constantly learning to stay ahead in this ever-evolving tech landscape.
            For me, being a developer is not just about code — it's about creating experiences that solve real problems and deliver real value.
          </p>
        </div>

        <HorizontalLine />

        {/* Skills ,Degree & Experience Info */}
        <section className='w-225 h-50 mx-auto mt-7 mb-5 flex'>
          <div>
            <h1 className='text-4xl font-bold mb-5'
              style={{ fontFamily: 'Elephant, serif' }}>Education</h1>
            <p>2020 - 2024</p>
            <p className='text-lg font-bold mb-1'
              style={{ fontFamily: 'Elephant, serif' }}>HAVARD CS50 DEGREE <br /></p>
            <p className='mb-10'>Havard University</p>
            <p>2024 - 2029</p>
            <p className='text-lg font-bold mb-1'
              style={{ fontFamily: 'Elephant, serif' }}>VKU CS - K24 DEGREE</p>
            <p className='mb-10'>Vietnam - Korea University</p>
            <HorizontalLine className='w-70 ml-0 mb-5' />
            <h1 className='text-4xl font-bold mb-5'
              style={{ fontFamily: 'Elephant, serif' }}>Skills</h1>
            <ul className='list-disc ml-5 space-y-5'>
              <li>Full-stack Web Developer</li>
              <li>Data Analyst</li>
              <li>AI Engineer</li>
              <li>Bussiness Startup</li>
              <li>English C2-level</li>
              <li>Korean C2-level</li>
              <li>Overpowered Position</li>
              <li>Left foot: 10/10</li>
              <li>Right foot: 10/10</li>
            </ul>
          </div>
          <VerticalLine className='ml-5 h-200 mr-10' />
          <div>
              <h1 className='text-4xl font-bold mb-5'
              style={{ fontFamily: 'Elephant, serif' }}>EXPERIENCE</h1>
          </div>
        </section>
      </Paper>
    </div>
  )
}
