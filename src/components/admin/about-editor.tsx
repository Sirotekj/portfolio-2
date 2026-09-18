'use client';

import type { AboutEditorData } from '@/types/types';

import {
  deleteEducationAction,
  deleteHobbyAction,
  deleteJobAction,
  deleteLanguageAction,
  deleteSkillAction,
  reorderEducationAction,
  reorderHobbiesAction,
  reorderJobsAction,
  reorderLanguagesAction,
  reorderSkillsAction,
} from '@/lib/actions/about-actions';

import AboutListEditor from '@/components/admin/about-list-editor';
import AboutPageForm from '@/components/forms/about-page-form';
import EducationForm from '@/components/forms/about-education-form';
import HobbyForm from '@/components/forms/about-hobby-form';
import JobForm from '@/components/forms/about-job-form';
import LanguageForm from '@/components/forms/about-language-form';
import SkillForm from '@/components/forms/about-skill-form';

type AboutEditorProps = {
  data: AboutEditorData;
};

function LevelDots({ level }: { level: number }) {
  return (
    <span className="about-level-dots">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={`skill-circle ${index < level ? 'skill-circle-full' : ''}`}
        />
      ))}
    </span>
  );
}

export default function AboutEditor({ data }: AboutEditorProps) {
  return (
    <div className="admin-editor">
      <AboutPageForm aboutPage={data.aboutPage} />

      <AboutListEditor
        title="Dovednosti"
        description="Pořadí měníš přetažením. Úroveň je 1–5."
        items={data.skills}
        emptyLabel="Zatím žádné dovednosti."
        addLabel="Přidat dovednost"
        entityLabel="dovednost"
        onReorder={reorderSkillsAction}
        onDelete={deleteSkillAction}
        getItemDeleteLabel={(skill) => skill.name}
        Form={SkillForm}
        renderItem={(skill) => (
          <>
            <p className="admin-item-title">{skill.name}</p>
            <LevelDots level={skill.level} />
          </>
        )}
      />

      <AboutListEditor
        title="Vzdělání"
        items={data.education}
        emptyLabel="Zatím žádné vzdělání."
        addLabel="Přidat vzdělání"
        entityLabel="vzdělání"
        onReorder={reorderEducationAction}
        onDelete={deleteEducationAction}
        getItemDeleteLabel={(education) =>
          `${education.years} – ${education.school}`
        }
        Form={EducationForm}
        renderItem={(education) => (
          <>
            <p className="admin-item-title">{education.years}</p>
            <p className="admin-item-meta">{education.school}</p>
          </>
        )}
      />

      <AboutListEditor
        title="Jazyky"
        items={data.languages}
        emptyLabel="Zatím žádné jazyky."
        addLabel="Přidat jazyk"
        entityLabel="jazyk"
        onReorder={reorderLanguagesAction}
        onDelete={deleteLanguageAction}
        getItemDeleteLabel={(language) => language.name}
        Form={LanguageForm}
        renderItem={(language) => (
          <>
            <p className="admin-item-title">{language.name}</p>
            <LevelDots level={language.level} />
          </>
        )}
      />

      <AboutListEditor
        title="Koníčky"
        items={data.hobbies}
        emptyLabel="Zatím žádné koníčky."
        addLabel="Přidat koníček"
        entityLabel="koníček"
        onReorder={reorderHobbiesAction}
        onDelete={deleteHobbyAction}
        getItemDeleteLabel={(hobby) => hobby.name}
        Form={HobbyForm}
        renderItem={(hobby) => (
          <p className="admin-item-title">{hobby.name}</p>
        )}
      />

      <AboutListEditor
        title="Pracovní zkušenosti"
        items={data.jobs}
        emptyLabel="Zatím žádné pracovní zkušenosti."
        addLabel="Přidat zkušenost"
        entityLabel="pracovní zkušenost"
        onReorder={reorderJobsAction}
        onDelete={deleteJobAction}
        getItemDeleteLabel={(job) =>
          `${job.years} – ${job.description.split('\n')[0]}`
        }
        Form={JobForm}
        renderItem={(job) => (
          <>
            <p className="admin-item-title">{job.years}</p>
            <p className="admin-item-meta--pre">
              {job.description}
            </p>
          </>
        )}
      />
    </div>
  );
}
