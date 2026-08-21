export default function PhotographerInfo({ user, size = 'md' }) {
  if (!user) return null;

  const avatarSize = size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  const nameSize = size === 'lg' ? 'text-base font-semibold' : 'text-sm font-medium';

  return (
    <a
      href={`${user.links?.html}?utm_source=pixora&utm_medium=referral`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 group"
    >
      {user.profile_image?.medium ? (
        <img
          src={user.profile_image.medium}
          alt={`${user.name}'s avatar`}
          className={`${avatarSize} rounded-full object-cover border border-border`}
        />
      ) : (
        <div className={`${avatarSize} rounded-full bg-surface-secondary flex items-center justify-center text-text-secondary font-medium border border-border`}>
          {user.name?.charAt(0) || '?'}
        </div>
      )}
      <div className="min-w-0">
        <p className={`${nameSize} text-text-primary group-hover:text-accent transition-colors truncate`}>
          {user.name}
        </p>
        {size === 'lg' && user.username && (
          <p className="text-xs text-text-muted">@{user.username}</p>
        )}
      </div>
    </a>
  );
}
