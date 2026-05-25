import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Braces,
  Code2,
  Link as LinkIcon,
  Save,
  Share2,
  SquareTerminal,
} from "lucide-react";
import {
  favoriteTags,
  languageDistribution,
  recentProfileEdits,
} from "../data/snippets";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { pageTransition } from "../animations/transitions";
import avatarUrl from "../assets/avatar.svg";

const iconMap = {
  Braces,
  SquareTerminal,
  Code2,
};

function ImpactCard() {
  const metrics = [
    ["Total Snippets", "1,402"],
    ["Edits This Month", "+84"],
    ["Public Forks", "329"],
  ];

  return (
    <section className="dev-card p-7">
      <h2 className="text-3xl font-extrabold text-text">Impact</h2>
      <div className="mt-12 divide-y divide-white/10">
        {metrics.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-5 first:pt-0 last:pb-0">
            <span className="font-semibold text-slate-300">{label}</span>
            <span className="mono text-xl text-text">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProfileHero() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <section className="dev-card bg-soft-gradient p-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-center">
        <img
          src={user.avatarUrl || avatarUrl}
          alt={user.name}
          className="h-28 w-28 rounded-full border-4 border-borderSoft bg-ink object-cover shadow-glow"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-extrabold text-text md:text-5xl">
              {user.name}
            </h1>
            <span className="rounded-full bg-periwinkle/15 px-3 py-1 mono text-sm font-semibold text-periwinkle">
              {user.plan}
            </span>
          </div>
          <p className="mt-2 mono text-periwinkle">{user.handle}</p>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-300">{user.bio || "No bio added yet."}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button className="ghost-button py-2">
              <LinkIcon size={18} />
              Website
            </button>
            <button className="ghost-button py-2">
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LanguageDistribution() {
  return (
    <section className="dev-card p-7">
      <div className="flex items-center gap-3">
        <Code2 className="text-periwinkle" size={28} />
        <h2 className="text-3xl font-extrabold text-text">Language Distribution</h2>
      </div>
      <div className="mt-7 flex h-3 overflow-hidden rounded-full bg-panelMuted">
        {languageDistribution.map((item) => (
          <span
            key={item.label}
            style={{ width: `${item.value}%`, backgroundColor: item.color }}
          />
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {languageDistribution.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-slate-300">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-semibold">
              {item.label} ({item.value}%)
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentlyEdited() {
  return (
    <section className="dev-card p-7">
      <div className="mb-7 flex items-center justify-between">
        <h2 className="text-3xl font-extrabold text-text">Recently Edited</h2>
        <a href="#all-edits" className="font-semibold text-periwinkle">
          View All
        </a>
      </div>
      <div className="space-y-6">
        {recentProfileEdits.map((item) => {
          const Icon = iconMap[item.icon] ?? Braces;
          return (
            <div key={item.title} className="flex items-center gap-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-ink text-periwinkle">
                <Icon size={22} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-text">{item.title}</h3>
                <p className="text-sm font-medium text-slate-300">{item.meta}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TagsCard() {
  return (
    <section className="dev-card p-7">
      <h2 className="text-3xl font-extrabold text-text">Favorite Tags</h2>
      <div className="mt-7 flex flex-wrap gap-3">
        {favoriteTags.map((tag) => (
          <span key={tag} className="rounded-md bg-white/[0.08] px-3 py-2 mono text-slate-200">
            #{tag}
          </span>
        ))}
      </div>
    </section>
  );
}

function AccountProfile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const { pushToast } = useToast();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
    }
  }, [user]);

  function handleSave() {
    updateUser({ name, bio });
    pushToast({
      title: "Profile saved",
      message: "Your profile details have been successfully updated.",
    });
  }

  if (!user) return null;

  return (
    <section className="dev-card p-7">
      <h2 className="text-3xl font-extrabold text-text">Account Profile</h2>
      <label className="mt-7 block">
        <span className="mb-2 block font-medium text-slate-300">Display Name</span>
        <input className="input-shell" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className="mt-5 block">
        <span className="mb-2 block font-medium text-slate-300">Bio</span>
        <textarea
          className="input-shell min-h-28 resize-none"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
        />
      </label>
      <button
        className="gradient-button mt-6 w-full"
        onClick={handleSave}
      >
        <Save size={18} />
        Save Changes
      </button>
    </section>
  );
}

export function ProfilePage() {
  return (
    <motion.div {...pageTransition} className="grid gap-7 xl:grid-cols-[1fr_380px]">
      <div className="space-y-7">
        <ProfileHero />
        <LanguageDistribution />
        <RecentlyEdited />
      </div>
      <aside className="space-y-7">
        <ImpactCard />
        <TagsCard />
        <AccountProfile />
      </aside>
    </motion.div>
  );
}
