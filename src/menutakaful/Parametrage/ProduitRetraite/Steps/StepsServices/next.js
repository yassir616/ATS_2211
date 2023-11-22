export const next = (context, number) => {
  if (context.state.current === number) {
    const current = context.state.current + 1;
    context.setState({ current });
    context.props.check(current);
  }
};