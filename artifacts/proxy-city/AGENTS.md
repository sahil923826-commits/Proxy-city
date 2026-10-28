<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Bandwidth pricing lives only in src/lib/pricing.ts (tested in pricing.test.ts); UI must call it, never duplicate tier math.
- Payment providers are gated by a `configured` flag in purchase-traffic; never mark orders paid client-side — only after backend/provider verification.
- Shared spacing roles are defined in src/styles.css and consumed by the shell, panels and fields; use content-driven, top-aligned grids to prevent empty stretched cards.
- Purchase Traffic uses independent content-sized column stacks rather than shared grid rows; keep Order Summary and Payment Method in one right-hand stack so either card can grow without stretching the left column.
