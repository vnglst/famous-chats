<script>
	import { toHSL } from './toHSL.js';
	import { onMount, afterUpdate } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export let data;

	let main;
	$: typing = '';

	$: queue = [...data.messages];
	$: messages = [];

	function handleNext() {
		const next = queue.shift();
		if (!next) return;
		const duration = Math.min(Math.max(next.body.length * 30, 2500), 10_000);

		setTimeout(() => {
			typing = next.author;
		}, 1000);

		setTimeout(() => {
			messages.push(next);
			messages = messages;
			typing = '';
			handleNext();
		}, duration);
	}

	onMount(() => {
		handleNext();
	});

	const viewpoint = 'Elon Musk';

	afterUpdate(() => {
		main.scrollIntoView({ behavior: 'smooth', block: 'end' });
	});
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<main bind:this={main}>
	<h1>To: <span>Jack Dorsey<span /></span></h1>

	{#each messages as message (message.body)}
		<article animate:flip in:fade class:user={message.author === viewpoint}>
			<div class="meta">
				<span class="user">{message.author}</span>
			</div>
			<div
				class="body"
				style="background-color: {message.author !== viewpoint && toHSL(message.author)}"
			>
				{@html message.body}
			</div>
		</article>
	{/each}

	{#if typing && typing !== viewpoint}
		<div class="typing-indicator">
			<span />
			<span />
			<span />
		</div>
	{/if}
</main>

<style>
	h1 {
		text-align: left;
		font-size: 20px;
		color: #888;
		margin-bottom: 3rem;
	}

	h1 > span {
		color: #555;
	}

	main {
		max-width: 35rem;
		overflow-y: auto;
		padding-bottom: 4rem;
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	article {
		margin: 0 0 1em 0;
	}

	a {
		color: inherit;
		text-decoration: underline;
	}

	.meta {
		font-size: 10px;
		margin: 0.5em;
	}

	.body {
		max-width: 20em;
		display: inline-block;
		position: relative;
		line-height: 1.8;
		padding: 0.4em 1em;
		background-color: #eee;
		border-radius: 1em 1em 1em 0;

		/* This makes sure returns are also rendered */
		white-space: pre-wrap;

		/* The trouble you have to go through to keep simple text inside a div! 😆 */
		/* Source: https://css-tricks.com/snippets/css/prevent-long-urls-from-breaking-out-of-container/ */

		/* These are technically the same, but use both */
		overflow-wrap: break-word;
		word-wrap: break-word;

		-ms-word-break: break-all;
		/* This is the dangerous one in WebKit, as it breaks things wherever */
		word-break: break-all;
		/* Instead use this non-standard one: */
		word-break: break-word;
	}

	.user {
		text-align: right;
	}

	.user > .body {
		margin-left: 4em;
		background-color: #0074d9;
		color: white;
		border-radius: 1em 1em 0 1em;
	}

	.typing-indicator {
		background-color: #e6e7ed;
		width: 40px;
		border-radius: 50px;
		padding: 15px;
		display: table;
		position: relative;
		animation: 2s bulge infinite ease-out;
	}

	.typing-indicator span {
		height: 10px;
		width: 10px;
		float: left;
		margin: 0 1px;
		background-color: #9e9ea1;
		display: block;
		border-radius: 50%;
		opacity: 0.4;
	}

	.typing-indicator span:nth-of-type(1) {
		animation: 1s blink infinite 0.3333s;
	}

	.typing-indicator span:nth-of-type(2) {
		animation: 1s blink infinite 0.6666s;
	}

	.typing-indicator span:nth-of-type(3) {
		animation: 1s blink infinite 0.9999s;
	}

	@-webkit-keyframes blink {
		50% {
			opacity: 1;
		}
	}

	@keyframes blink {
		50% {
			opacity: 1;
		}
	}
</style>
