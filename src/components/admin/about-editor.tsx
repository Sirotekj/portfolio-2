'use client';

import type { AboutEditorData } from '@/types/types';

import {
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
    <span className="ml-2 truncate">
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
    <div className="space-y-8">
      <AboutPageForm aboutPage={data.aboutPage} />

      <AboutListEditor
        title="Dovednosti"
        description="Pořadí měníš přetažením. Úroveň je 1–5."
        items={data.skills}
        emptyLabel="Zatím žádné dovednosti."
        addLabel="Přidat dovednost"
        onReorder={reorderSkillsAction}
        Form={SkillForm}
        renderItem={(skill) => (
          <>
            <p className="font-medium text-foreground">{skill.name}</p>
            <LevelDots level={skill.level} />
          </>
        )}
      />

      <AboutListEditor
        title="Jazyky"
        items={data.languages}
        emptyLabel="Zatím žádné jazyky."
        addLabel="Přidat jazyk"
        onReorder={reorderLanguagesAction}
        Form={LanguageForm}
        renderItem={(language) => (
          <>
            <p className="font-medium text-foreground">{language.name}</p>
            <LevelDots level={language.level} />
          </>
        )}
      />

      <AboutListEditor
        title="Koníčky"
        items={data.hobbies}
        emptyLabel="Zatím žádné koníčky."
        addLabel="Přidat koníček"
        onReorder={reorderHobbiesAction}
        Form={HobbyForm}
        renderItem={(hobby) => (
          <p className="font-medium text-foreground">{hobby.name}</p>
        )}
      />

      <AboutListEditor
        title="Vzdělání"
        items={data.education}
        emptyLabel="Zatím žádné vzdělání."
        addLabel="Přidat vzdělání"
        onReorder={reorderEducationAction}
        Form={EducationForm}
        renderItem={(education) => (
          <>
            <p className="font-medium text-foreground">{education.years}</p>
            <p className="text-sm text-light">{education.school}</p>
          </>
        )}
      />

      <AboutListEditor
        title="Pracovní zkušenosti"
        items={data.jobs}
        emptyLabel="Zatím žádné pracovní zkušenosti."
        addLabel="Přidat zkušenost"
        onReorder={reorderJobsAction}
        Form={JobForm}
        renderItem={(job) => (
          <>
            <p className="font-medium text-foreground">{job.years}</p>
            <p className="whitespace-pre-line text-sm text-light">
              {job.description}
            </p>
          </>
        )}
      />
    </div>
  );
}
