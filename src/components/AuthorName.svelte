<script lang="ts">
	import type { Author } from '~/lib/reddit/types';

	export let author: Author;
</script>

<span
	class:text-red-500={author.role === 'admin'}
	class:text-green-700={author.role === 'moderator'}
	title={author.role}
>
	u/{author.name}
</span>
