import {
  Paper,
  ProfileImg,
  PaperHeader,
  VerticalLine,
  HorizontalLine,
  ContactContent,
  ProfileInfoDiv,
  AbilityInfoDiv
} from '@/components/ui/cv_paper'

export default function CVPage() {
  return (
    <div className="min-h-screen py-10 mt-[var(--spacing-top)] px-4 md:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-center">CV Builder</h1>
        <p className="mt-4 text-gray-600 mb-10 text-center">
          Create and manage your professional CV here. This page will be
          implemented with a comprehensive CV builder.
        </p>
      </div>
      <Paper>
        <PaperHeader>
          <div className="flex items-center space-x-6">
            {/* Ảnh */}
            <ProfileImg className='w-20 h-20 md:w-40 md:h-40 sm:w-30 sm:h-30 lg:w-50 lg:h-50'>
              <img
                src="https://i.pinimg.com/originals/9b/c9/40/9bc940893848b63365d368e939d63bc1.jpg"
                alt="Ronalsi"
                className="rounded-full object-cover"
              />
            </ProfileImg>

            {/* Line dọc */}
            <VerticalLine className='h-100 sm:h-85 md:h-75 lg:h-70' />

            {/* Nội dung */}
            <div className="flex-1 min-w-0 ml-2 sm:ml-4 md:ml-6 lg:ml-8">
              <div className="mb-5">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold"
                  style={{ fontFamily: 'Elephant, serif' }}>Cris Leo Ronalsi</h1>
                <p className="text-gray-600 text-md sm:text-lg md:text-xl lg:text-2xl mx-1">Full-Stack Developer</p>
              </div>

              {/* Phần liên lạc */}
              <ContactContent>
                <div className='min-w-0 flex-1'>
                  <span className="text-xs sm:text-base md:text-lg lg:text-xl font-bold"
                    style={{ fontFamily: 'Elephant, serif' }}>EMAIL</span> <br />
                  <p className="px-1 text-xs sm:text-xs md:text-sm lg:text-base break-all">{`abcdxyz1234@domain.com`}</p>
                </div>
                <VerticalLine className="hidden sm:block h-19 sm:h-17 md:h-15 lg:h-13 mx-2" />
                <div className='min-w-0 flex-1'>
                  <span className="text-xs sm:text-base md:text-lg lg:text-xl font-bold"
                    style={{ fontFamily: 'Elephant, serif' }}>PHONE</span> <br />
                  <p className="px-1 text-xs sm:text-xs md:text-sm lg:text-base break-all">{`+1234-567-8909`}</p>
                </div>
              </ContactContent>

              <HorizontalLine className="w-5/6 sm:w-82 md:w-101 lg:w-148 ml-0 sm:ml-1 my-2 sm:my-3 md:my-4 lg:my-5"/>

              <ContactContent>
                <div className='min-w-0 flex-1'>
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold"
                    style={{ fontFamily: 'Elephant, serif' }}>WEBSITE</span> <br />
                  <p className="px-1 text-xs sm:text-xs md:text-sm lg:text-base break-all">{`http://localhost:3000/profile`}</p>
                </div>
                <VerticalLine className="hidden sm:block h-19 sm:h-17 md:h-15 lg:h-13 mx-2" />
                <div className='min-w-0 flex-1'>
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold"
                    style={{ fontFamily: 'Elephant, serif' }}>ADDRESS</span> <br />
                  <p className="px-1 text-xs sm:text-xs md:text-sm lg:text-base break-all">{`123, ABC Street, Da Nang`}</p>
                </div>
              </ContactContent>
            </div>
          </div>
        </PaperHeader>

        {/* Line ngang */}
        <HorizontalLine />

        {/*Profile Info*/}
        <ProfileInfoDiv>
          <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-5'
            style={{ fontFamily: 'Elephant, serif' }}>My Profile</h1>
          <p className='text-balance '>
            Hi, I'm Cris Leo Ronalsi, a Full-Stack Developer with a passion for building clean, efficient, and user-focused web applications.
            I specialize in working with technologies like React, Next.js, Node.js, and MongoDB, and enjoy tackling challenges across both front-end and back-end.
            I take pride in writing maintainable code, collaborating effectively with teams, and constantly learning to stay ahead in this ever-evolving tech landscape.
            For me, being a developer is not just about code — it's about creating experiences that solve real problems and deliver real value.
          </p>
        </ProfileInfoDiv>

        <HorizontalLine />

        {/* Skills ,Degree & Experience Info */}
        <AbilityInfoDiv>
          <div>
            <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-5'
              style={{ fontFamily: 'Elephant, serif' }}>Education</h1>
            <p>2020 - 2024</p>
            <p className='text-2xs sm:text-sm md:text-base lg:text-lg font-bold mb-1'
              style={{ fontFamily: 'Elephant, serif' }}>HAVARD CS50 DEGREE <br /></p>
            <p className='mb-10'>Havard University</p>
            <p>2024 - 2029</p>
            <p className='text-2xs sm:text-sm md:text-base lg:text-lg font-bold mb-1'
              style={{ fontFamily: 'Elephant, serif' }}>VKU CS - K24 DEGREE</p>
            <p className='mb-10'>Vietnam - Korea University</p>
            <HorizontalLine className='w-30 sm:w-40 md:w-60 lg:w-70 ml-0 mb-5' />
            <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-5'
              style={{ fontFamily: 'Elephant, serif' }}>Skills</h1>
            <ul className='list-disc ml-5 space-y-1 sm:space-y-2 md:space-y-3 lg:space-y-5 text-2xs sm:text-xs md:text-sm lg:text-base'>
              <li>Full-stack Web Developer</li>
              <li>Data Analyst</li>
              <li>AI Engineer</li>
              <li>Bussiness Startup</li>
              <li>English C2-level</li>
              <li>Vietnamese C2-level</li>
              <li>Overpowered Position</li>
              <li>Left foot: 10/10</li>
              <li>Right foot: 10/10</li>
            </ul>
          </div>
          <VerticalLine className='ml-5 h-240 sm:h-220 md:h-210 lg:h-200 mr-10' />
          <div>
            <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-5'
              style={{ fontFamily: 'Elephant, serif' }}>Experience</h1>
          </div>
        </AbilityInfoDiv>
      </Paper>
    </div>
  )
}
