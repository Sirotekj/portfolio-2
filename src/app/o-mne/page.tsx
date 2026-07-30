import type { Metadata } from 'next';

import {
  getAbout,
  getSkills,
  getEducation,
  getLanguages,
  getHobbies,
  getJobs,
} from '../../data/dummy-about';

export const metadata: Metadata = {
  title: 'O mně',
};

export default function AboutPage() {
  const textsAbout = getAbout();
  const textsSkills = getSkills();
  const textsEducation = getEducation();
  const textsLanguages = getLanguages();
  const textsHobbies = getHobbies();
  const textsJobs = getJobs();
  return (
    <>
      <section>
        <div className="container my-xlarge">
          <div className="after:clear-both after:content-[''] after:block">
            <div className="w-full mb-medium mr-large overflow-hidden sm:w-2/5 sm:float-left md:w-1/3  rounded-xl shadow-xl">
              <picture>
                <img src={textsAbout.photo} alt="About photo" />
              </picture>
            </div>
            <div className="">{textsAbout.intro}</div>
          </div>
        </div>
        <div className="container my-xlarge">
          <div className="grid grid-cols-1 gap-4 px-large pb-large border-border border shadow-xl rounded-xl mb-12 lg:grid-cols-2">
            <div className="col-span-1">
              <h2>Dovednosti</h2>
              <ul>
                {textsSkills.map((skill) => (
                  <li key={skill.skill}>
                    {skill.skill}
                    <span className="ml-2 truncate">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          className={`skill-circle ${i < skill.level ? 'skill-circle-full' : ''}`}
                          key={i}
                        ></span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
              <h2>Vzdělání</h2>
              <ul>
                {textsEducation.reverse().map((education) => (
                  <li key={education.school}>
                    <b>{education.years}</b> - {education.school}
                  </li>
                ))}
              </ul>
              <h2>Jazyky</h2>
              <ul>
                {textsLanguages.map((language) => (
                  <li key={language.language}>
                    {language.language}
                    <span className="ml-2 truncate">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          className={`skill-circle ${i < language.level ? 'skill-circle-full' : ''}`}
                          key={i}
                        ></span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
              <h2>Koníčky</h2>
              <p>{textsHobbies}</p>
            </div>
            <div className="col-span-1">
              <h2>Pracovní zkušenosti</h2>
              <ul>
                {textsJobs.reverse().map((job) => (
                  <li key={job.name}>
                    <b>{job.years}</b> - {job.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
