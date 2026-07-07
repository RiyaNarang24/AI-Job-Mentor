
  document.getElementById('get-guidance-btn').addEventListener('click', async () => {
    const name = document.getElementById('name').value.trim();
    const occupation = document.getElementById('occupation').value.trim();
    const location = document.getElementById('location').value.trim();
    const education = document.getElementById('education').value;
    const skills = document.getElementById('skills').value.trim();
    const goal = document.getElementById('goal').value.trim();

    if (!name || !occupation || !location || !skills || !goal) {
      alert('Please fill in all fields!');
      return;
    }

    const btn = document.getElementById('get-guidance-btn');
    const loader = document.getElementById('loader');
    const btnLabel = document.getElementById('btn-label');

    btn.disabled = true;
    loader.style.display = 'block';
    btnLabel.textContent = 'Analysing...';

    try {
      const response = await fetch('/api/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, occupation, location, education, skills, goal })
      });

      const data = await response.json();
      const text = data.guidance || 'No guidance received.';

      document.getElementById('out-greeting').textContent = `Career Guidance for ${name}`;
      document.getElementById('out-advice').textContent = text;

      document.getElementById('out-jobs').innerHTML = `<li>Check local construction firms in ${location}</li><li>Register on NCS Portal (ncs.gov.in)</li><li>Look for skilled mason roles nearby</li>`;
      document.getElementById('out-schemes').innerHTML = `<li>PM Kaushal Vikas Yojana (PMKVY)</li><li>MUDRA Yojana — small business loans</li><li>e-Shram — worker registration</li>`;
      document.getElementById('out-skills').innerHTML = `<li>Free ITI courses near you</li><li>NSDC online skill programs</li><li>YouTube vocational training</li>`;

      const stepsDiv = document.getElementById('out-steps');
      stepsDiv.innerHTML = `
        <div class="step"><div class="step-num">1</div><div class="step-body"><strong>Register on e-Shram</strong> — Get your worker ID card at eshram.gov.in</div></div>
        <div class="step"><div class="step-num">2</div><div class="step-body"><strong>Apply for PMKVY</strong> — Find your nearest skill center at pmkvyofficial.org</div></div>
        <div class="step"><div class="step-num">3</div><div class="step-body"><strong>Create NCS Profile</strong> — Post your skills at ncs.gov.in to get job offers</div></div>
        <div class="step"><div class="step-num">4</div><div class="step-body"><strong>Apply for MUDRA Loan</strong> — Visit your nearest bank for micro business funding</div></div>
        <div class="step"><div class="step-num">5</div><div class="step-body"><strong>Upskill yourself</strong> — Join a free ITI or NSDC course to increase your income</div></div>
      `;

      document.getElementById('output').style.display = 'block';
      document.getElementById('output').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
      alert('Error connecting to server. Make sure server.js is running!');
      console.error(error);
    } finally {
      btn.disabled = false;
      loader.style.display = 'none';
      btnLabel.textContent = 'Get Guidance';
    }
  });
