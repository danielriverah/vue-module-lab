export default {
    inserted(el, binding) {
        const options = {
            html: binding.value,
            position: binding.arg || 'top'
        };

        el.classList.add('tooltipped');
        el.setAttribute('data-tooltip', options.html);

        el._tooltipInstance = M.Tooltip.init(el, options);
    },
    unbind(el) {
        if (el._tooltipInstance) {
            el._tooltipInstance.destroy();
        }
    }
};
  