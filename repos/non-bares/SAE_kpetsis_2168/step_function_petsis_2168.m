function y = step_function_petsis_2168(transf_f)
  hold on;
  plot(step(transf_f),'r--');
  plot(step(minreal(transf_f)),'b*');
  hold off;
end