export const prev = (context) => {
    const current = context.state.current - 1;
    context.setState({ current });
    context.props.check(current);
  }
